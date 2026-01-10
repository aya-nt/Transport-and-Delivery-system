#!/usr/bin/env python
import os
import sys
import django
import random
from decimal import Decimal
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_system.settings')
django.setup()

from logistics.models import *
from django.utils import timezone

def fix_service_types_and_invoices():
    print("Adding International service type and ensuring all shipments have invoices...")
    
    # Add International service type
    international, created = ServiceType.objects.get_or_create(name='International')
    if created:
        print("Created International service type")
    
    # Create pricing rules for International service
    destinations = Destination.objects.all()
    for dest in destinations:
        rule, created = PricingRule.objects.get_or_create(
            destination=dest,
            service_type=international,
            defaults={
                'base_tariff': Decimal('1200.00'),  # Higher for international
                'weight_rate': Decimal('45.00'),
                'volume_rate': Decimal('85.00'),
            }
        )
        if created:
            print(f"Created pricing rule: {dest.name} - International")
    
    # Update some shipments to use International service
    shipments = list(Shipment.objects.all())
    for i in range(0, len(shipments), 4):  # Every 4th shipment
        shipment = shipments[i]
        shipment.service_type = international
        shipment.calculated_cost = shipment.calculate_cost()
        shipment.save()
        print(f"Updated {shipment.tracking_number} to International service")
    
    # Ensure every shipment has an invoice
    shipments_without_invoice = []
    for shipment in Shipment.objects.all():
        has_invoice = Invoice.objects.filter(shipments=shipment).exists()
        if not has_invoice:
            shipments_without_invoice.append(shipment)
    
    print(f"Found {len(shipments_without_invoice)} shipments without invoices")
    
    # Group shipments by client and create invoices
    client_shipments = {}
    for shipment in shipments_without_invoice:
        if shipment.client not in client_shipments:
            client_shipments[shipment.client] = []
        client_shipments[shipment.client].append(shipment)
    
    for client, shipments in client_shipments.items():
        # Create invoices in batches of 1-3 shipments
        while shipments:
            batch_size = min(random.randint(1, 3), len(shipments))
            batch = shipments[:batch_size]
            shipments = shipments[batch_size:]
            
            # Random date based on oldest shipment in batch
            oldest_date = min(s.date for s in batch)
            invoice_date = oldest_date.date() + timedelta(days=random.randint(1, 7))
            
            invoice = Invoice.objects.create(
                client=client,
                date=invoice_date,
                status=random.choice(['UNPAID', 'PARTIAL', 'PAID'])
            )
            invoice.shipments.set(batch)
            invoice.calculate_totals()
            
            # Set payment amounts
            if invoice.status == 'PARTIAL':
                invoice.paid_amount = invoice.amount_ttc * Decimal(str(random.uniform(0.2, 0.8)))
            elif invoice.status == 'PAID':
                invoice.paid_amount = invoice.amount_ttc
            
            invoice.save()
            print(f"Created invoice #{invoice.id} for {client.name} with {len(batch)} shipments")
    
    print("\n=== FINAL STATISTICS ===")
    print(f"Service Types: {ServiceType.objects.count()}")
    for service in ServiceType.objects.all():
        count = Shipment.objects.filter(service_type=service).count()
        print(f"  {service.name}: {count} shipments")
    
    print(f"\nTotal Invoices: {Invoice.objects.count()}")
    print(f"Shipments without invoice: {len([s for s in Shipment.objects.all() if not Invoice.objects.filter(shipments=s).exists()])}")
    
    # Revenue by service type
    print("\nRevenue by Service Type:")
    for service in ServiceType.objects.all():
        revenue = sum(
            invoice.amount_ttc for invoice in Invoice.objects.all() 
            if any(s.service_type == service for s in invoice.shipments.all())
        )
        print(f"  {service.name}: {revenue} DA")

if __name__ == '__main__':
    fix_service_types_and_invoices()