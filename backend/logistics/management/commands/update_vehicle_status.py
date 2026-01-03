from django.core.management.base import BaseCommand
from logistics.models import Vehicle

class Command(BaseCommand):
    help = 'Update vehicle statuses based on active tours'

    def handle(self, *args, **options):
        vehicles = Vehicle.objects.all()
        for vehicle in vehicles:
            vehicle.update_status()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {vehicles.count()} vehicle statuses')
        )
