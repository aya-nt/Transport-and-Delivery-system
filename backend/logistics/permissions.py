from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Admin: Full access
    Others: Read only
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'ADMIN'

class IsAdminOrManager(permissions.BasePermission):
    """
    Admin & Manager: Full access
    Others: No access
    """
    def has_permission(self, request, view):
        return request.user.role in ['ADMIN', 'MANAGER']

class IsAdminOrAgentOrReadOnly(permissions.BasePermission):
    """
    Admin & Agent: Full access
    Others: Read only
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role in ['ADMIN', 'AGENT']

class CanManageShipments(permissions.BasePermission):
    """
    Admin, Manager, Agent: Can manage shipments
    Driver: Can only view and update status of assigned shipments
    """
    def has_permission(self, request, view):
        if request.user.role in ['ADMIN', 'MANAGER', 'AGENT']:
            return True
        if request.user.role == 'DRIVER' and request.method in ['GET', 'PATCH']:
            return True
        return False

class IsDriver(permissions.BasePermission):
    """
    Only drivers can access
    """
    def has_permission(self, request, view):
        return request.user.role == 'DRIVER'
