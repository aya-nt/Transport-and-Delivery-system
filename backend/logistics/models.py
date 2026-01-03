from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from decimal import Decimal
import re

# Validators
def validate_algerian_phone(value):
    """Validate Algerian phone format: 10 digits starting with 0"""
    if not re.match(r'^0\d{9}$', value):
        raise ValidationError('Format invalide. Le téléphone doit commencer par 0 et contenir 10 chiffres (ex: 0555123456)')

def validate_algerian_license(value):
    """Validate Algerian driver's license format: 8 digits"""
    if not re.match(r'^\d{8}$', value):
        raise ValidationError('Format invalide. Le permis doit contenir 8 chiffres (ex: 01123456)')

def validate_algerian_plate(value):
    """Validate Algerian vehicle plate format: 6 digits - 2 digits"""
    if not re.match(r'^\d{6}-\d{2}$', value):
        raise ValidationError('Format invalide. La plaque doit être: 6 chiffres - 2 chiffres wilaya (ex: 123456-16)')

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        MANAGER = 'MANAGER', _('Manager')
        AGENT = 'AGENT', _('Transport Agent')
        DRIVER = 'DRIVER', _('Driver')

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.AGENT)

class Client(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        INACTIVE = 'INACTIVE', _('Inactive')

    name = models.CharField(max_length=255)
    address = models.TextField()
    contact_info = models.CharField(max_length=255, validators=[validate_algerian_phone], help_text="Format: 0555123456")
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Driver(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', _('Available')
        ON_DUTY = 'ON_DUTY', _('On Duty')
        OFF_DUTY = 'OFF_DUTY', _('Off Duty')

    name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=50, unique=True, validators=[validate_algerian_license], help_text="Format: 01123456 (8 chiffres)")
    phone = models.CharField(max_length=20, validators=[validate_algerian_phone], help_text="Format: 0555123456")
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    hire_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='driver_profile')

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', _('Disponible')
        IN_USE = 'IN_USE', _('En Service')
        MAINTENANCE = 'MAINTENANCE', _('En Maintenance')

    license_plate = models.CharField(max_length=20, unique=True, validators=[validate_algerian_plate], help_text="Format: 123456-16")
    capacity = models.FloatField(help_text="Capacity in kg or m3")
    vehicle_type = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)

    def update_status(self):
        """Automatically update status based on active tours"""
        from django.utils import timezone
        today = timezone.now().date()
        
        # Check if vehicle has an active tour today
        active_tour = self.tour_set.filter(date=today).exists()
        
        if active_tour and self.status != self.Status.MAINTENANCE:
            self.status = self.Status.IN_USE
        elif self.status == self.Status.IN_USE:
            self.status = self.Status.AVAILABLE
        
        self.save()

    def __str__(self):
        return f"{self.vehicle_type} - {self.license_plate}"

class Destination(models.Model):
    name = models.CharField(max_length=255)
    zone = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class ServiceType(models.Model):
    name = models.CharField(max_length=100) # e.g. Standard, Express

    def __str__(self):
        return self.name

class PricingRule(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    base_tariff = models.DecimalField(max_digits=10, decimal_places=2)
    weight_rate = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost per kg")
    volume_rate = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost per m3")

    def __str__(self):
        return f"{self.destination} - {self.service_type}"

class Shipment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        IN_TRANSIT = 'IN_TRANSIT', _('In Transit')
        SORTING_CENTER = 'SORTING_CENTER', _('Sorting Center')
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', _('Out for Delivery')
        DELIVERED = 'DELIVERED', _('Delivered')
        DELIVERY_FAILED = 'DELIVERY_FAILED', _('Delivery Failed')

    tracking_number = models.CharField(max_length=50, unique=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='shipments')
    destination = models.ForeignKey(Destination, on_delete=models.PROTECT)
    service_type = models.ForeignKey(ServiceType, on_delete=models.PROTECT)
    driver = models.ForeignKey(Driver, on_delete=models.PROTECT, related_name='shipments', null=True, blank=True)
    
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    updated_at = models.DateTimeField(auto_now=True)
    
    calculated_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def calculate_cost(self):
        # Find pricing rule
        try:
            rule = PricingRule.objects.get(destination=self.destination, service_type=self.service_type)
            cost = rule.base_tariff + (self.weight * rule.weight_rate) + (self.volume * rule.volume_rate)
            return cost
        except PricingRule.DoesNotExist:
            return Decimal('0.00')

    def save(self, *args, **kwargs):
        if not self.calculated_cost:
            self.calculated_cost = self.calculate_cost()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.tracking_number

class ShipmentStatusHistory(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Shipment.Status.choices)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.shipment.tracking_number} - {self.status} at {self.timestamp}"

class Tour(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.PROTECT)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT)
    date = models.DateField()
    shipments = models.ManyToManyField(Shipment, related_name='tours')
    
    def save(self, *args, **kwargs):
        # Update status before saving
        if self.paid_amount >= self.amount_ttc:
            self.status = self.Status.PAID
        elif self.paid_amount > 0:
            self.status = self.Status.PARTIAL
        else:
            self.status = self.Status.UNPAID
        super().save(*args, **kwargs)
        # Update vehicle status when tour is created
        self.vehicle.update_status()
    
    def __str__(self):
        return f"Tour {self.id} - {self.driver}"

class Invoice(models.Model):
    class Status(models.TextChoices):
        UNPAID = 'UNPAID', _('Unpaid')
        PARTIAL = 'PARTIAL', _('Partially Paid')
        PAID = 'PAID', _('Paid')

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='invoices')
    shipments = models.ManyToManyField(Shipment, related_name='invoices')
    date = models.DateField(auto_now_add=True)
    
    amount_ht = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tva = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_ttc = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.UNPAID)

    @property
    def remaining_balance(self):
        return self.amount_ttc - self.paid_amount

    def update_status(self):
        """Automatically update status based on paid amount"""
        if self.paid_amount >= self.amount_ttc:
            self.status = self.Status.PAID
        elif self.paid_amount > 0:
            self.status = self.Status.PARTIAL
        else:
            self.status = self.Status.UNPAID

    def calculate_totals(self):

        total_ht = sum(s.calculated_cost for s in self.shipments.all() if s.calculated_cost)
        self.amount_ht = total_ht
        self.tva = total_ht * Decimal('0.19') # 19% TVA
        self.amount_ttc = self.amount_ht + self.tva
        self.save()

    def __str__(self):
        return f"Invoice {self.id} - {self.client}"

class Incident(models.Model):
    class Status(models.TextChoices):
        OPEN = 'OPEN', _('Open')
        RESOLVED = 'RESOLVED', _('Resolved')

    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='incidents')
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.OPEN)

    def __str__(self):
        return f"Incident on {self.shipment}"

@receiver(pre_save, sender=Invoice)
def update_invoice_status(sender, instance, **kwargs):
    """Update invoice status before saving"""
    paid = Decimal(str(instance.paid_amount))
    total = Decimal(str(instance.amount_ttc))
    
    if paid >= total:
        instance.status = Invoice.Status.PAID
    elif paid > 0:
        instance.status = Invoice.Status.PARTIAL
    else:
        instance.status = Invoice.Status.UNPAID

@receiver(post_save, sender=User)
def create_driver_profile(sender, instance, created, **kwargs):
    """Automatically create Driver record when a DRIVER user is created"""
    if created and instance.role == 'DRIVER':
        Driver.objects.create(
            user=instance,
            name=f"{instance.first_name} {instance.last_name}" if instance.first_name else instance.username,
            license_number=f"DRV{instance.id:05d}",
            phone="0000000000",
            email=instance.email,
            status=Driver.Status.AVAILABLE
        )
