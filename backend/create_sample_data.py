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
    
    # Create Destinations (Algerian cities)
    destinations = [
        {'name': 'Alger Centre', 'zone': 'Alger'},
        {'name': 'Oran Es Senia', 'zone': 'Oran'},
        {'name': 'Constantine', 'zone': 'Constantine'},
        {'name': 'Annaba', 'zone': 'Annaba'},
        {'name': 'Blida', 'zone': 'Blida'},
        {'name': 'Sétif', 'zone': 'Sétif'},
        {'name': 'Batna', 'zone': 'Batna'},
        {'name': 'Tlemcen', 'zone': 'Tlemcen'},
    ]
    
    for dest_data in destinations:
        dest, created = Destination.objects.get_or_create(**dest_data)
        if created:
            print(f"Created destination: {dest.name}")
    
    # Create Service Types
    service_types = [
        {'name': 'Standard'},
        {'name': 'Express'},
        {'name': 'Économique'},
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
            base_tariff = Decimal('500.00')  # Algerian Dinar
            if service.name == 'Express':
                base_tariff = Decimal('750.00')
            elif service.name == 'Économique':
                base_tariff = Decimal('350.00')
                
            rule, created = PricingRule.objects.get_or_create(
                destination=dest,
                service_type=service,
                defaults={
                    'base_tariff': base_tariff,
                    'weight_rate': Decimal('25.00'),  # DA per kg
                    'volume_rate': Decimal('50.00'),  # DA per m3
                }
            )
            if created:
                print(f"Created pricing rule: {dest.name} - {service.name}")
    
    # Create Clients (Algerian companies)
    clients = [
        {'name': 'SARL Naftal Distribution', 'address': '123 Rue Didouche Mourad, Alger 16000', 'contact_info': '0555123456'},
        {'name': 'EURL Cevital Logistique', 'address': '456 Boulevard Zabana, Oran 31000', 'contact_info': '0666789012'},
        {'name': 'SPA Condor Electronics', 'address': '789 Avenue Aouati Mostefa, Constantine 25000', 'contact_info': '0777345678'},
        {'name': 'SARL Danone Djurdjura', 'address': '321 Rue Larbi Ben Mhidi, Blida 09000', 'contact_info': '0555987654'},
        {'name': 'EURL Mobilis Telecom', 'address': '654 Boulevard Houari Boumediene, Sétif 19000', 'contact_info': '0666543210'},
    ]
    
    for client_data in clients:
        client, created = Client.objects.get_or_create(**client_data)
        if created:
            print(f"Created client: {client.name}")
    
    # Create Driver Users and Drivers (Algerian names)
    drivers_data = [
        {'name': 'Ahmed Benali', 'license_number': '01234567', 'phone': '0555111222', 'email': 'ahmed.benali@transport.dz'},
        {'name': 'Mohamed Khelifi', 'license_number': '12345678', 'phone': '0666333444', 'email': 'mohamed.khelifi@transport.dz'},
        {'name': 'Karim Boumediene', 'license_number': '23456789', 'phone': '0777555666', 'email': 'karim.boumediene@transport.dz'},
        {'name': 'Youcef Mammeri', 'license_number': '34567890', 'phone': '0555777888', 'email': 'youcef.mammeri@transport.dz'},
        {'name': 'Rachid Benaissa', 'license_number': '45678901', 'phone': '0666999000', 'email': 'rachid.benaissa@transport.dz'},
    ]
    
    for driver_data in drivers_data:
        # Create user for driver
        username = driver_data['name'].lower().replace(' ', '.')
        user, user_created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': driver_data['email'],
                'first_name': driver_data['name'].split()[0],
                'last_name': driver_data['name'].split()[1],
                'role': 'DRIVER'
            }
        )
        if user_created:
            user.set_password('driver123')
            user.save()
            print(f"Created driver user: {username}")
        
        # Create driver profile
        driver, created = Driver.objects.get_or_create(
            license_number=driver_data['license_number'],
            defaults={
                'name': driver_data['name'],
                'phone': driver_data['phone'],
                'email': driver_data['email'],
                'address': f"Cité {random.choice(['El Biar', 'Hydra', 'Ben Aknoun', 'Dely Ibrahim'])}, Alger",
                'hire_date': timezone.now().date() - timedelta(days=random.randint(30, 365))
            }
        )
        if created:
            # Only set user if driver was created and doesn't have one
            if not driver.user:
                driver.user = user
                driver.save()
            print(f"Created driver: {driver.name}")
    
    # Create Vehicles (Algerian license plates)
    vehicles = [
        {'license_plate': '123456-16', 'capacity': 1000.0, 'vehicle_type': 'Camion'},
        {'license_plate': '654321-31', 'capacity': 500.0, 'vehicle_type': 'Fourgon'},
        {'license_plate': '789012-06', 'capacity': 2000.0, 'vehicle_type': 'Poids Lourd'},
        {'license_plate': '456789-25', 'capacity': 750.0, 'vehicle_type': 'Camionnette'},
        {'license_plate': '987654-09', 'capacity': 1500.0, 'vehicle_type': 'Camion Frigorifique'},
    ]
    
    for vehicle_data in vehicles:
        vehicle, created = Vehicle.objects.get_or_create(**vehicle_data)
        if created:
            print(f"Created vehicle: {vehicle.license_plate}")
    
    # Create Agent Users
    agents_data = [
        {'username': 'agent1', 'email': 'agent1@transport.dz', 'first_name': 'Amina', 'last_name': 'Boudjelal'},
        {'username': 'agent2', 'email': 'agent2@transport.dz', 'first_name': 'Farid', 'last_name': 'Cherif'},
        {'username': 'manager1', 'email': 'manager1@transport.dz', 'first_name': 'Salim', 'last_name': 'Hadj'},
    ]
    
    for agent_data in agents_data:
        user, created = User.objects.get_or_create(
            username=agent_data['username'],
            defaults={
                'email': agent_data['email'],
                'first_name': agent_data['first_name'],
                'last_name': agent_data['last_name'],
                'role': 'MANAGER' if 'manager' in agent_data['username'] else 'AGENT'
            }
        )
        if created:
            user.set_password('agent123')
            user.save()
            print(f"Created agent user: {agent_data['username']}")
    
    # Create Sample Shipments
    clients_qs = Client.objects.all()
    drivers_qs = Driver.objects.all()
    
    shipments_created = []
    for i in range(15):
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
                'description': f'Colis {random.choice(["électronique", "alimentaire", "textile", "pharmaceutique"])}',
                'status': random.choice(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'SORTING_CENTER']),
            }
        )
        if created:
            shipments_created.append(shipment)
            print(f"Created shipment: {shipment.tracking_number}")
    
    # Create Sample Claims
    claim_types = ['DAMAGED_PACKAGE', 'LOST_PACKAGE', 'LATE_DELIVERY', 'WRONG_DELIVERY', 'BILLING_ISSUE', 'SERVICE_QUALITY']
    claim_descriptions = {
        'DAMAGED_PACKAGE': 'Le colis est arrivé endommagé avec des traces de choc.',
        'LOST_PACKAGE': 'Le colis n\'est pas arrivé à destination dans les délais prévus.',
        'LATE_DELIVERY': 'La livraison a eu lieu avec 3 jours de retard par rapport à la date prévue.',
        'WRONG_DELIVERY': 'Le colis a été livré à une mauvaise adresse.',
        'BILLING_ISSUE': 'Erreur dans la facturation, montant incorrect.',
        'SERVICE_QUALITY': 'Service client non satisfaisant lors de la prise en charge.'
    }
    
    agents_qs = User.objects.filter(role__in=['AGENT', 'MANAGER'])
    
    for i in range(8):
        claim_type = random.choice(claim_types)
        client = random.choice(clients_qs)
        shipment = random.choice(shipments_created) if shipments_created else None
        assigned_to = random.choice(agents_qs) if random.choice([True, False]) else None
        
        claim, created = Claim.objects.get_or_create(
            client=client,
            shipment=shipment,
            claim_type=claim_type,
            defaults={
                'description': claim_descriptions[claim_type],
                'assigned_to': assigned_to,
                'status': random.choice(['PENDING', 'IN_PROGRESS', 'RESOLVED']),
                'date': timezone.now() - timedelta(days=random.randint(1, 30))
            }
        )
        if created:
            print(f"Created claim: #{claim.id} - {claim.get_claim_type_display()}")
    
    # Create Sample Invoices
    for client in clients_qs[:3]:
        client_shipments = [s for s in shipments_created if s.client == client][:3]
        if client_shipments:
            invoice, created = Invoice.objects.get_or_create(
                client=client,
                defaults={
                    'date': timezone.now().date() - timedelta(days=random.randint(1, 15))
                }
            )
            if created:
                invoice.shipments.set(client_shipments)
                invoice.calculate_totals()
                print(f"Created invoice: #{invoice.id} for {client.name}")
    
    print("\n=== SAMPLE DATA CREATED SUCCESSFULLY ===")
    print(f"Clients: {Client.objects.count()}")
    print(f"Drivers: {Driver.objects.count()}")
    print(f"Vehicles: {Vehicle.objects.count()}")
    print(f"Shipments: {Shipment.objects.count()}")
    print(f"Claims: {Claim.objects.count()}")
    print(f"Users: {User.objects.count()}")
    print(f"Invoices: {Invoice.objects.count()}")
    
    print("\n=== LOGIN CREDENTIALS ===")
    print("Admin: admin / admin123")
    print("Drivers: ahmed.benali / driver123, mohamed.khelifi / driver123, etc.")
    print("Agents: agent1 / agent123, agent2 / agent123, manager1 / agent123")

if __name__ == '__main__':
    create_sample_data()