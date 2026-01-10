from rest_framework import serializers
from .models import User, Client, Driver, Vehicle, Destination, ServiceType, PricingRule, Shipment, ShipmentStatusHistory, Tour, Invoice, Incident

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'AGENT')
        )
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            if attr != 'username':  # Don't allow username changes
                setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = '__all__'

class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = '__all__'

class ShipmentStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentStatusHistory
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    client_contact = serializers.CharField(source='client.contact_info', read_only=True)
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    service_type_name = serializers.CharField(source='service_type.name', read_only=True)
    driver_name = serializers.CharField(source='driver.name', read_only=True)
    status_history = ShipmentStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'
        read_only_fields = ['calculated_cost']
    
    def update(self, instance, validated_data):
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Update shipment
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Create history entry if status changed
        if old_status != new_status:
            ShipmentStatusHistory.objects.create(
                shipment=instance,
                status=new_status
            )
        
        return instance

class TourSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.name', read_only=True)
    vehicle_plate = serializers.CharField(source='vehicle.license_plate', read_only=True)
    
    class Meta:
        model = Tour
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    remaining_balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['remaining_balance', 'status']

    def create(self, validated_data):
        shipments = validated_data.pop('shipments', [])
        invoice = Invoice.objects.create(**validated_data)
        invoice.shipments.set(shipments)
        invoice.save()
        return invoice

    def update(self, instance, validated_data):
        shipments = validated_data.pop('shipments', None)
        
        # Update all fields
        instance.client = validated_data.get('client', instance.client)
        instance.amount_ht = validated_data.get('amount_ht', instance.amount_ht)
        instance.tva = validated_data.get('tva', instance.tva)
        instance.amount_ttc = validated_data.get('amount_ttc', instance.amount_ttc)
        instance.paid_amount = validated_data.get('paid_amount', instance.paid_amount)
        
        if shipments is not None:
            instance.shipments.set(shipments)
        
        instance.save()  # This triggers the pre_save signal
        return instance

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'
