from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ClientViewSet, DriverViewSet, VehicleViewSet, 
    DestinationViewSet, ServiceTypeViewSet, PricingRuleViewSet, 
    ShipmentViewSet, TourViewSet, InvoiceViewSet, IncidentViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'destinations', DestinationViewSet)
router.register(r'service-types', ServiceTypeViewSet)
router.register(r'pricing-rules', PricingRuleViewSet)
router.register(r'shipments', ShipmentViewSet)
router.register(r'tours', TourViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'incidents', IncidentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
