from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Client
from .serializers import ClientSerializer
from users.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client_list(request):
    """Only superusers can view all clients"""
    if not request.user.is_superuser:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    clients = Client.objects.all()
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client_detail(request, pk):
    """Get client profile - users can only see their own, superusers can see all"""
    try:
        client = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Users can only see their own profile, superusers can see any
    if not request.user.is_superuser and request.user != client.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ClientSerializer(client)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def client_update(request, pk):
    """Update client - only superusers can update"""
    if not request.user.is_superuser:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        client = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ClientSerializer(client, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def client_delete(request, pk):
    """Delete client and associated user - only superusers can delete"""
    if not request.user.is_superuser:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        client = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Deleting the user will cascade delete the client
    user = client.user
    user.delete()
    
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def client_create(request):
    """Create new client - only superusers can create"""
    if not request.user.is_superuser:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Try to get existing user by email
        user = User.objects.get(email=email)
        # Check if user already has a client profile
        if hasattr(user, 'client_profile'):
            return Response({'error': 'This user already has a client profile'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        # Create new user if doesn't exist (username is optional now)
        user = User.objects.create_user(email=email, password='temp123')
    
    # Create client linked to user
    try:
        client = Client.objects.create(
            user=user,
            first_name=request.data.get('first_name', ''),
            last_name=request.data.get('last_name', ''),
            age=request.data.get('age'),
            phone=request.data.get('phone', '')
        )
        serializer = ClientSerializer(client)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
