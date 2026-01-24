from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Client, Driver, Vehicle, Destination, ServiceType, 
    PricingRule, Shipment, Tour, Invoice, Incident, Claim
)

class CustomUserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'reset_token', 'reset_token_expires')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('role',)}),
    )
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_staff']
    list_filter = BaseUserAdmin.list_filter + ('role',)

# Register your models here.
admin.site.register(User, CustomUserAdmin)
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
admin.site.register(Claim)
