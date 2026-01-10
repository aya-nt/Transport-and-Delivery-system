#!/usr/bin/env python
import os
import sys
import django
import random
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_system.settings')
django.setup()

from logistics.models import *
from django.utils import timezone

def add_incidents():
    print("Adding incident data...")
    
    shipments = list(Shipment.objects.all())
    
    incident_descriptions = [
        'Retard de livraison dû à la circulation',
        'Problème mécanique du véhicule',
        'Adresse de livraison incorrecte',
        'Colis endommagé pendant le transport',
        'Client absent lors de la livraison',
        'Problème météorologique',
        'Panne de carburant',
        'Accident mineur',
        'Problème de sécurité',
        'Véhicule en panne',
        'Route bloquée',
        'Grève des transporteurs'
    ]
    
    for i in range(25):
        shipment = random.choice(shipments)
        days_ago = random.randint(1, 45)
        incident_date = timezone.now() - timedelta(days=days_ago)
        
        incident = Incident.objects.create(
            shipment=shipment,
            description=random.choice(incident_descriptions),
            status=random.choice(['OPEN', 'RESOLVED']),
            date=incident_date
        )
        print(f'Created incident #{incident.id} for {incident.shipment.tracking_number}')
    
    print(f'\nTotal incidents: {Incident.objects.count()}')
    
    # Show incident statistics
    print("\nIncident Statistics:")
    open_count = Incident.objects.filter(status='OPEN').count()
    resolved_count = Incident.objects.filter(status='RESOLVED').count()
    print(f"  OPEN: {open_count}")
    print(f"  RESOLVED: {resolved_count}")

if __name__ == '__main__':
    add_incidents()