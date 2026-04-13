import cloudinary.uploader  # type: ignore
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Recipe
from .serializers import RecipeSerializer, RecipeAdminSerializer


def _admin_guard(request):
    if not request.user.is_superuser:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    return None


def _delete_recipe_image(recipe):
    image_field = recipe.image
    if not image_field:
        return
    public_id = getattr(image_field, 'public_id', None)
    if not public_id and isinstance(image_field, str):
        public_id = image_field.strip()
    if not public_id:
        return
    try:
        cloudinary.uploader.destroy(public_id)
    except Exception:
        # Keep delete flow resilient even if cloud cleanup fails.
        pass

@api_view(['GET'])
def post_list(request):
    recipes = Recipe.objects.all()
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def post_detail(request, slug):
    try:
        recipe = Recipe.objects.get(slug=slug)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = RecipeSerializer(recipe)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_post_list_create(request):
    denied = _admin_guard(request)
    if denied:
        return denied

    if request.method == 'GET':
        recipes = Recipe.objects.all()
        serializer = RecipeAdminSerializer(recipes, many=True)
        return Response(serializer.data)

    serializer = RecipeAdminSerializer(data=request.data)
    if serializer.is_valid():
        recipe = serializer.save()
        return Response(RecipeAdminSerializer(recipe).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_post_detail(request, pk):
    denied = _admin_guard(request)
    if denied:
        return denied

    try:
        recipe = Recipe.objects.get(pk=pk)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(RecipeAdminSerializer(recipe).data)

    if request.method in ['PATCH', 'PUT']:
        serializer = RecipeAdminSerializer(recipe, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            recipe = serializer.save()
            return Response(RecipeAdminSerializer(recipe).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    _delete_recipe_image(recipe)
    recipe.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)