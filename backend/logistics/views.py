from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from .models import User, Client, Driver, Vehicle, Destination, ServiceType, PricingRule, Shipment, Tour, Invoice, Incident
from .serializers import (
    UserSerializer, ClientSerializer, DriverSerializer, VehicleSerializer, 
    DestinationSerializer, ServiceTypeSerializer, PricingRuleSerializer, 
    ShipmentSerializer, TourSerializer, InvoiceSerializer, IncidentSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer

class PricingRuleViewSet(viewsets.ModelViewSet):
    queryset = PricingRule.objects.all()
    serializer_class = PricingRuleSerializer

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer

    @action(detail=True, methods=['get'])
    def slip(self, request, pk=None):
        shipment = self.get_object()
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="shipment_{shipment.tracking_number}.pdf"'
        
        p = canvas.Canvas(response, pagesize=letter)
        p.drawString(100, 750, f"Shipment Slip: {shipment.tracking_number}")
        p.drawString(100, 730, f"Client: {shipment.client.name}")
        p.drawString(100, 710, f"Destination: {shipment.destination.name}")
        p.drawString(100, 690, f"Service: {shipment.service_type.name}")
        p.drawString(100, 670, f"Weight: {shipment.weight} kg")
        p.drawString(100, 650, f"Volume: {shipment.volume} m3")
        p.drawString(100, 630, f"Status: {shipment.status}")
        p.showPage()
        p.save()
        return response

    @action(detail=False, methods=['get'])
    def stats(self, request):
        # Shipment Status Distribution
        status_counts = Shipment.objects.values('status').annotate(count=Count('status'))
        
        # Revenue per Month (based on Invoices for simplicity, or Shipments)
        # Using Shipments calculated_cost for revenue estimation
        revenue_per_month = Shipment.objects.annotate(month=TruncMonth('date')).values('month').annotate(revenue=Sum('calculated_cost')).order_by('month')
        
        # Incidents per Month
        incidents_per_month = Incident.objects.annotate(month=TruncMonth('date')).values('month').annotate(count=Count('id')).order_by('month')

        return Response({
            "status_distribution": status_counts,
            "revenue_over_time": revenue_per_month,
            "incidents_over_time": incidents_per_month
        })

class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        invoice = self.get_object()
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.id}.pdf"'
        
        p = canvas.Canvas(response, pagesize=letter)
        p.drawString(100, 750, f"INVOICE #{invoice.id}")
        p.drawString(100, 730, f"Client: {invoice.client.name}")
        p.drawString(100, 710, f"Date: {invoice.date}")
        p.drawString(100, 680, "Shipments:")
        y = 660
        for shipment in invoice.shipments.all():
            p.drawString(120, y, f"- {shipment.tracking_number}: ${shipment.calculated_cost}")
            y -= 20
        
        p.drawString(100, y-20, f"Total HT: ${invoice.amount_ht}")
        p.drawString(100, y-40, f"TVA (19%): ${invoice.tva}")
        p.drawString(100, y-60, f"Total TTC: ${invoice.amount_ttc}")
        p.showPage()
        p.save()
        return response

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

