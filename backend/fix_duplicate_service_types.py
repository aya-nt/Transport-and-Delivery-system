#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Fix duplicate service types (Economique and Economique)
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_system.settings')
django.setup()

from logistics.models import ServiceType, Shipment, PricingRule

print("Checking for duplicate service types...\n")

# Find all service types
all_services = ServiceType.objects.all()
print("Current Service Types:")
for service in all_services:
    shipment_count = Shipment.objects.filter(service_type=service).count()
    pricing_rule_count = PricingRule.objects.filter(service_type=service).count()
    print(f"  ID: {service.id}, Name: '{service.name}', Shipments: {shipment_count}, Pricing Rules: {pricing_rule_count}")

# Check for duplicates (case-insensitive and accent-insensitive)
variants = ServiceType.objects.filter(name__icontains='economique')
if variants.count() > 1:
    print(f"\nFound {variants.count()} 'Economique' variants:")
    for svc in variants:
        print(f"  - ID {svc.id}: '{svc.name}'")
    
    # Find the one to keep (prefer the one with accent or the one with more shipments)
    variants_list = list(variants)
    variants_list.sort(key=lambda x: (Shipment.objects.filter(service_type=x).count(), x.name), reverse=True)
    keep_service = variants_list[0]
    services_to_merge = variants_list[1:]
    
    print(f"\nKeeping: ID {keep_service.id} - '{keep_service.name}'")
    print(f"Merging into it:")
    
    for service_to_remove in services_to_merge:
        shipment_count = Shipment.objects.filter(service_type=service_to_remove).count()
        pricing_rule_count = PricingRule.objects.filter(service_type=service_to_remove).count()
        print(f"  - ID {service_to_remove.id} - '{service_to_remove.name}' (Shipments: {shipment_count}, Pricing Rules: {pricing_rule_count})")
        
        # Update shipments
        if shipment_count > 0:
            Shipment.objects.filter(service_type=service_to_remove).update(service_type=keep_service)
            print(f"    Moved {shipment_count} shipments")
        
        # Update pricing rules
        if pricing_rule_count > 0:
            # Check if pricing rule already exists for keep_service
            for rule in PricingRule.objects.filter(service_type=service_to_remove):
                existing_rule = PricingRule.objects.filter(
                    destination=rule.destination,
                    service_type=keep_service
                ).first()
                
                if existing_rule:
                    # Rule already exists, delete the duplicate
                    rule.delete()
                    print(f"    Deleted duplicate pricing rule for {rule.destination.name}")
                else:
                    # Move the rule
                    rule.service_type = keep_service
                    rule.save()
                    print(f"    Moved pricing rule for {rule.destination.name}")
        
        # Delete the duplicate service type
        service_to_remove.delete()
        print(f"    Deleted duplicate service type")
    
    print("\nCleanup complete!")
else:
    print("\nNo duplicates found")

print("\nFinal Service Types:")
for service in ServiceType.objects.all():
    shipment_count = Shipment.objects.filter(service_type=service).count()
    print(f"  ID: {service.id}, Name: '{service.name}', Shipments: {shipment_count}")
