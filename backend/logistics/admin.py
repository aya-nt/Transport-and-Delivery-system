from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Client, Driver, Vehicle, Destination, ServiceType, 
    PricingRule, Shipment, Tour, Invoice, Incident
)

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Client)
admin.site.register(Driver)
admin.site.register(Vehicle)
admin.site.register(Destination)
admin.site.register(ServiceType)
admin.site.register(PricingRule)
admin.site.register(Shipment)
admin.site.register(Tour)
admin.site.register(Invoice)
admin.site.register(Incident)
