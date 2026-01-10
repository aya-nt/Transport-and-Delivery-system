#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
import random
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_system.settings')
django.setup()

from logistics.models import *
from django.utils import timezone

def create_sample_data():
    print("Creating sample data with Algerian formats...")
    
    # Create Destinations
    destinations = [
        {'name': 'Alger Centre', 'zone': 'Alger'},
        {'name': 'Oran Es Senia', 'zone': 'Oran'},
        {'name': 'Constantine', 'zone': 'Constantine'},
        {'name': 'Annaba', 'zone': 'Annaba'},
        {'name': 'Blida', 'zone': 'Blida'},
    ]
    
    for dest_data in destinations:
        dest, created = Destination.objects.get_or_create(**dest_data)
        if created:
            print(f"Created destination: {dest.name}")
    
    # Create Service Types
    service_types = [
        {'name': 'Standard'},
        {'name': 'Express'},
        {'name': 'Economique'},
    ]
    
    for service_data in service_types:
        service, created = ServiceType.objects.get_or_create(**service_data)
        if created:
            print(f"Created service type: {service.name}")
    
    # Create Pricing Rules
    destinations_qs = Destination.objects.all()
    services_qs = ServiceType.objects.all()
    
    for dest in destinations_qs:
        for service in services_qs:
            base_tariff = Decimal('500.00')
            if service.name == 'Express':
                base_tariff = Decimal('750.00')
            elif service.name == 'Economique':
                base_tariff = Decimal('350.00')
                
            rule, created = PricingRule.objects.get_or_create(
                destination=dest,
                service_type=service,
                defaults={
                    'base_tariff': base_tariff,
                    'weight_rate': Decimal('25.00'),
                    'volume_rate': Decimal('50.00'),
                }
            )
            if created:
                print(f"Created pricing rule: {dest.name} - {service.name}")
    
    # Create Clients
    clients = [
        {'name': 'SARL Naftal Distribution', 'address': '123 Rue Didouche Mourad, Alger 16000', 'contact_info': '0555123456'},
        {'name': 'EURL Cevital Logistique', 'address': '456 Boulevard Zabana, Oran 31000', 'contact_info': '0666789012'},
        {'name': 'SPA Condor Electronics', 'address': '789 Avenue Aouati Mostefa, Constantine 25000', 'contact_info': '0777345678'},
        {'name': 'SARL Danone Djurdjura', 'address': '321 Rue Larbi Ben Mhidi, Blida 09000', 'contact_info': '0555987654'},
    ]
    
    for client_data in clients:
        client, created = Client.objects.get_or_create(**client_data)
        if created:
            print(f"Created client: {client.name}")
    
    # Create Drivers
    drivers = [
        {'name': 'Ahmed Benali', 'license_number': '01234567', 'phone': '0555111222'},
        {'name': 'Mohamed Khelifi', 'license_number': '12345678', 'phone': '0666333444'},
        {'name': 'Karim Boumediene', 'license_number': '23456789', 'phone': '0777555666'},
    ]
    
    for driver_data in drivers:
        driver, created = Driver.objects.get_or_create(**driver_data)
        if created:
            print(f"Created driver: {driver.name}")
    
    # Create Vehicles
    vehicles = [
        {'license_plate': '123456-16', 'capacity': 1000.0, 'vehicle_type': 'Camion'},
        {'license_plate': '654321-31', 'capacity': 500.0, 'vehicle_type': 'Fourgon'},
        {'license_plate': '789012-06', 'capacity': 2000.0, 'vehicle_type': 'Poids Lourd'},
    ]
    
    for vehicle_data in vehicles:
        vehicle, created = Vehicle.objects.get_or_create(**vehicle_data)
        if created:
            print(f"Created vehicle: {vehicle.license_plate}")
    
    # Create Agent Users
    agent1, created = User.objects.get_or_create(
        username='agent1',
        defaults={
            'email': 'agent1@transport.dz',
            'first_name': 'Amina',
            'last_name': 'Boudjelal',
            'role': 'AGENT'
        }
    )
    if created:
        agent1.set_password('agent123')
        agent1.save()
        print("Created agent1")
    
    manager1, created = User.objects.get_or_create(
        username='manager1',
        defaults={
            'email': 'manager1@transport.dz',
            'first_name': 'Salim',
            'last_name': 'Hadj',
            'role': 'MANAGER'
        }
    )
    if created:
        manager1.set_password('manager123')
        manager1.save()
        print("Created manager1")
    
    # Create Sample Shipments
    clients_qs = Client.objects.all()
    drivers_qs = Driver.objects.all()
    
    shipments_created = []
    for i in range(10):
        tracking_number = f"DZ{2024}{1000 + i:04d}"
        client = random.choice(clients_qs)
        destination = random.choice(destinations_qs)
        service_type = random.choice(services_qs)
        driver = random.choice(drivers_qs)
        
        shipment, created = Shipment.objects.get_or_create(
            tracking_number=tracking_number,
            defaults={
                'client': client,
                'destination': destination,
                'service_type': service_type,
                'driver': driver,
                'weight': Decimal(str(random.uniform(1, 100))),
                'volume': Decimal(str(random.uniform(0.1, 10))),
                'description': f'Colis {random.choice(["electronique", "alimentaire", "textile"])}',
                'status': random.choice(['PENDING', 'IN_TRANSIT', 'DELIVERED']),
            }
        )
        if created:
            shipments_created.append(shipment)
            print(f"Created shipment: {shipment.tracking_number}")
    
    # Create Sample Claims
    claim_types = ['DAMAGED_PACKAGE', 'LOST_PACKAGE', 'LATE_DELIVERY', 'WRONG_DELIVERY', 'BILLING_ISSUE']
    claim_descriptions = {
        'DAMAGED_PACKAGE': 'Le colis est arrive endommage avec des traces de choc.',
        'LOST_PACKAGE': 'Le colis n\'est pas arrive a destination dans les delais prevus.',
        'LATE_DELIVERY': 'La livraison a eu lieu avec 3 jours de retard.',
        'WRONG_DELIVERY': 'Le colis a ete livre a une mauvaise adresse.',
        'BILLING_ISSUE': 'Erreur dans la facturation, montant incorrect.'
    }
    
    agents_qs = User.objects.filter(role__in=['AGENT', 'MANAGER'])
    
    for i in range(6):
        claim_type = random.choice(claim_types)
        client = random.choice(clients_qs)
        shipment = random.choice(shipments_created) if shipments_created else None
        assigned_to = random.choice(agents_qs) if random.choice([True, False]) else None
        
        claim = Claim.objects.create(
            client=client,
            shipment=shipment,
            claim_type=claim_type,
            description=claim_descriptions[claim_type],
            assigned_to=assigned_to,
            status=random.choice(['PENDING', 'IN_PROGRESS', 'RESOLVED']),
            date=timezone.now() - timedelta(days=random.randint(1, 30))
        )
        print(f"Created claim: #{claim.id} - {claim.get_claim_type_display()}")
    
    print("\n=== SAMPLE DATA CREATED SUCCESSFULLY ===")
    print(f"Clients: {Client.objects.count()}")
    print(f"Drivers: {Driver.objects.count()}")
    print(f"Vehicles: {Vehicle.objects.count()}")
    print(f"Shipments: {Shipment.objects.count()}")
    print(f"Claims: {Claim.objects.count()}")
    print(f"Users: {User.objects.count()}")
    
    print("\n=== LOGIN CREDENTIALS ===")
    print("Admin: admin / admin123")
    print("Agent: agent1 / agent123")
    print("Manager: manager1 / manager123")

if __name__ == '__main__':
    create_sample_data()