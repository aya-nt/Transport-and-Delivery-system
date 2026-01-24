from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from django.contrib.auth.hashers import check_password
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from .models import User, Client, Driver, Vehicle, Destination, ServiceType, PricingRule, Shipment, Tour, Invoice, Incident
from .serializers import (
    UserSerializer, ClientSerializer, DriverSerializer, VehicleSerializer, 
    DestinationSerializer, ServiceTypeSerializer, PricingRuleSerializer, 
    ShipmentSerializer, TourSerializer, InvoiceSerializer, IncidentSerializer
)
from .permissions import IsAdminOrReadOnly, IsAdminOrAgentOrReadOnly, CanManageShipments

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({'error': 'Both old and new passwords are required'}, status=400)

        if not check_password(old_password, user.password):
            return Response({'error': 'Current password is incorrect'}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def request_reset(self, request):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username is required'}, status=400)

        try:
            user = User.objects.get(username=username)
            token = user.generate_reset_token()
            print(f"\n=== PASSWORD RESET TOKEN ===")
            print(f"User: {username}")
            print(f"Token: {token}")
            print(f"Expires: {user.reset_token_expires}")
            print(f"===========================\n")
            return Response({'message': 'Reset token generated (check console)'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def reset_password(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not token or not new_password:
            return Response({'error': 'Token and new password are required'}, status=400)

        try:
            user = User.objects.get(reset_token=token)
            if not user.reset_token_expires or timezone.now() > user.reset_token_expires:
                return Response({'error': 'Token has expired'}, status=400)

            user.set_password(new_password)
            user.reset_token = None
            user.reset_token_expires = None
            user.save()
            return Response({'message': 'Password reset successfully'})
        except User.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=400)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, IsAdminOrAgentOrReadOnly]

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated, IsAdminOrAgentOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        driver = self.get_object()
        if driver.user:
            return Response(
                {"error": "Cannot delete driver with a user account. Delete the user account instead."},
                status=400
            )
        return super().destroy(request, *args, **kwargs)

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated, IsAdminOrAgentOrReadOnly]

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

class PricingRuleViewSet(viewsets.ModelViewSet):
    queryset = PricingRule.objects.all()
    serializer_class = PricingRuleSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

class ShipmentViewSet(viewsets.ModelViewSet):
    serializer_class = ShipmentSerializer
    filterset_fields = ['tracking_number', 'status', 'client']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'DRIVER':
            # Drivers only see their assigned shipments
            return Shipment.objects.filter(driver__user=user)
        return Shipment.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action in ['partial_update', 'update']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), CanManageShipments()]

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

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import random

@api_view(['GET'])
@permission_classes([AllowAny])
def driver_location(request, tracking_number):
    """
    Return simulated driver location for a shipment.
    In production, this would fetch real-time location from a driver mobile app.
    """
    try:
        shipment = Shipment.objects.get(tracking_number=tracking_number)
        # Only show driver location if shipment is in transit or out for delivery
        if shipment.status not in ['IN_TRANSIT', 'OUT_FOR_DELIVERY']:
            return Response({'location': None})
        
        # Simulated location around Algiers (36.7538, 3.0588)
        # In production, fetch from driver's device GPS
        location = {
            'lat': 36.7538 + random.uniform(-0.1, 0.1),
            'lng': 3.0588 + random.uniform(-0.1, 0.1),
            'timestamp': shipment.updated_at,
            'driver_name': shipment.driver.name if shipment.driver else None,
            'driver_phone': shipment.driver.phone if shipment.driver else None,
        }
        return Response({'location': location})
    except Shipment.DoesNotExist:
        return Response({'error': 'Shipment not found'}, status=404)

