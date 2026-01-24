#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Fix duplicate service types
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
    print(f"  ID: {service.id}, Name: {repr(service.name)}, Shipments: {shipment_count}, Pricing Rules: {pricing_rule_count}")

# Manually check for Economique duplicates
duplicate_list = []
for service in all_services:
    name_lower = service.name.lower()
    # Normalize accented characters
    normalized = name_lower.replace('é', 'e').replace('è', 'e').replace('ê', 'e').replace('É', 'e')
    if 'economique' in normalized:
        duplicate_list.append(service)

if len(duplicate_list) > 1:
    print(f"\nFound {len(duplicate_list)} 'Economique' variants:")
    for svc in duplicate_list:
        print(f"  - ID {svc.id}: {repr(svc.name)}")
    
    # Find the one to keep (prefer the one with more shipments, or keep "Economique" without accent)
    duplicate_list.sort(key=lambda x: (Shipment.objects.filter(service_type=x).count(), x.name == 'Economique', -x.id), reverse=True)
    keep_service = duplicate_list[0]
    services_to_merge = duplicate_list[1:]
    
    print(f"\nKeeping: ID {keep_service.id} - {repr(keep_service.name)}")
    print(f"Merging into it:")
    
    for service_to_remove in services_to_merge:
        shipment_count = Shipment.objects.filter(service_type=service_to_remove).count()
        pricing_rule_count = PricingRule.objects.filter(service_type=service_to_remove).count()
        print(f"  - ID {service_to_remove.id} - {repr(service_to_remove.name)} (Shipments: {shipment_count}, Pricing Rules: {pricing_rule_count})")
        
        # Update shipments
        if shipment_count > 0:
            Shipment.objects.filter(service_type=service_to_remove).update(service_type=keep_service)
            print(f"    Moved {shipment_count} shipments")
        
        # Update pricing rules
        if pricing_rule_count > 0:
            for rule in PricingRule.objects.filter(service_type=service_to_remove):
                existing_rule = PricingRule.objects.filter(
                    destination=rule.destination,
                    service_type=keep_service
                ).first()
                
                if existing_rule:
                    rule.delete()
                    print(f"    Deleted duplicate pricing rule for {rule.destination.name}")
                else:
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
