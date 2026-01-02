from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from decimal import Decimal

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        AGENT = 'AGENT', _('Transport Agent')

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.AGENT)

class Client(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact_info = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Driver(models.Model):
    name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=50, unique=True)
    phone = models.CharField(max_length=20)
    # Link to user if driver needs login access
    # user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    license_plate = models.CharField(max_length=20, unique=True)
    capacity = models.FloatField(help_text="Capacity in kg or m3")
    vehicle_type = models.CharField(max_length=50)

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
    
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
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

class Tour(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.PROTECT)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT)
    date = models.DateField()
    shipments = models.ManyToManyField(Shipment, related_name='tours')
    
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
