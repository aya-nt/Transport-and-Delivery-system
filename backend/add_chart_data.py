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

def add_more_data():
    print("Adding more sample data for charts...")
    
    # Get existing data
    clients_qs = Client.objects.all()
    drivers_qs = Driver.objects.all()
    destinations_qs = Destination.objects.all()
    services_qs = ServiceType.objects.all()
    vehicles_qs = Vehicle.objects.all()
    agents_qs = User.objects.filter(role__in=['AGENT', 'MANAGER'])
    
    # Create more shipments with varied dates (last 3 months)
    statuses = ['PENDING', 'IN_TRANSIT', 'SORTING_CENTER', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED']
    
    for i in range(50):  # Add 50 more shipments
        tracking_number = f"DZ{2024}{1010 + i:04d}"
        client = random.choice(clients_qs)
        destination = random.choice(destinations_qs)
        service_type = random.choice(services_qs)
        driver = random.choice(drivers_qs)
        
        # Random date in last 90 days
        days_ago = random.randint(1, 90)
        shipment_date = timezone.now() - timedelta(days=days_ago)
        
        shipment, created = Shipment.objects.get_or_create(
            tracking_number=tracking_number,
            defaults={
                'client': client,
                'destination': destination,
                'service_type': service_type,
                'driver': driver,
                'weight': Decimal(str(random.uniform(1, 200))),
                'volume': Decimal(str(random.uniform(0.1, 20))),
                'description': f'Colis {random.choice(["electronique", "alimentaire", "textile", "pharmaceutique", "automobile"])}',
                'status': random.choice(statuses),
                'date': shipment_date,
            }
        )
        if created:
            print(f"Created shipment: {shipment.tracking_number}")
    
    # Create more claims with varied dates
    claim_types = ['DAMAGED_PACKAGE', 'LOST_PACKAGE', 'LATE_DELIVERY', 'WRONG_DELIVERY', 'BILLING_ISSUE', 'SERVICE_QUALITY']
    claim_statuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED']
    
    shipments_qs = Shipment.objects.all()
    
    for i in range(25):  # Add 25 more claims
        claim_type = random.choice(claim_types)
        client = random.choice(clients_qs)
        shipment = random.choice(shipments_qs) if random.choice([True, False]) else None
        assigned_to = random.choice(agents_qs) if random.choice([True, False]) else None
        
        # Random date in last 60 days
        days_ago = random.randint(1, 60)
        claim_date = timezone.now() - timedelta(days=days_ago)
        
        claim = Claim.objects.create(
            client=client,
            shipment=shipment,
            claim_type=claim_type,
            description=f'Réclamation {claim_type.lower().replace("_", " ")} - {random.choice(["urgent", "normal", "faible priorité"])}',
            assigned_to=assigned_to,
            status=random.choice(claim_statuses),
            date=claim_date
        )
        print(f"Created claim: #{claim.id}")
    
    # Create more invoices
    for client in clients_qs:
        # Create 2-4 invoices per client
        for j in range(random.randint(2, 4)):
            client_shipments = list(Shipment.objects.filter(client=client))
            if client_shipments:
                selected_shipments = random.sample(client_shipments, min(random.randint(1, 3), len(client_shipments)))
                
                # Random date in last 45 days
                days_ago = random.randint(1, 45)
                invoice_date = timezone.now().date() - timedelta(days=days_ago)
                
                invoice = Invoice.objects.create(
                    client=client,
                    date=invoice_date,
                    status=random.choice(['UNPAID', 'PARTIAL', 'PAID'])
                )
                invoice.shipments.set(selected_shipments)
                invoice.calculate_totals()
                
                # Set random paid amount for partial payments
                if invoice.status == 'PARTIAL':
                    invoice.paid_amount = invoice.amount_ttc * Decimal(str(random.uniform(0.3, 0.8)))
                elif invoice.status == 'PAID':
                    invoice.paid_amount = invoice.amount_ttc
                
                invoice.save()
                print(f"Created invoice: #{invoice.id} for {client.name}")
    
    # Create more tours with varied dates
    for i in range(20):  # Add 20 tours
        driver = random.choice(drivers_qs)
        vehicle = random.choice(vehicles_qs)
        
        # Random date in last 30 days
        days_ago = random.randint(1, 30)
        tour_date = (timezone.now() - timedelta(days=days_ago)).date()
        
        tour = Tour.objects.create(
            driver=driver,
            vehicle=vehicle,
            date=tour_date,
            distance_km=Decimal(str(random.uniform(50, 500))),
            duration_hours=Decimal(str(random.uniform(2, 12))),
            fuel_consumption=Decimal(str(random.uniform(20, 80))),
            status=random.choice(['PLANNED', 'IN_PROGRESS', 'COMPLETED'])
        )
        
        # Add some shipments to the tour
        available_shipments = list(Shipment.objects.filter(date__date=tour_date)[:random.randint(1, 5)])
        if available_shipments:
            tour.shipments.set(available_shipments)
        
        print(f"Created tour: #{tour.id}")
    
    print("\n=== MORE DATA ADDED SUCCESSFULLY ===")
    print(f"Total Clients: {Client.objects.count()}")
    print(f"Total Drivers: {Driver.objects.count()}")
    print(f"Total Vehicles: {Vehicle.objects.count()}")
    print(f"Total Shipments: {Shipment.objects.count()}")
    print(f"Total Claims: {Claim.objects.count()}")
    print(f"Total Invoices: {Invoice.objects.count()}")
    print(f"Total Tours: {Tour.objects.count()}")
    print(f"Total Users: {User.objects.count()}")
    
    # Show some statistics for charts
    print("\n=== CHART DATA PREVIEW ===")
    print("Shipments by Status:")
    for status in ['PENDING', 'IN_TRANSIT', 'SORTING_CENTER', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED']:
        count = Shipment.objects.filter(status=status).count()
        print(f"  {status}: {count}")
    
    print("\nClaims by Status:")
    for status in ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED']:
        count = Claim.objects.filter(status=status).count()
        print(f"  {status}: {count}")
    
    print("\nRevenue by Month (last 3 months):")
    for i in range(3):
        month_start = timezone.now().replace(day=1) - timedelta(days=30*i)
        month_end = month_start + timedelta(days=30)
        revenue = Invoice.objects.filter(date__range=[month_start.date(), month_end.date()]).aggregate(
            total=models.Sum('amount_ttc')
        )['total'] or 0
        print(f"  {month_start.strftime('%B %Y')}: {revenue} DA")

if __name__ == '__main__':
    add_more_data()