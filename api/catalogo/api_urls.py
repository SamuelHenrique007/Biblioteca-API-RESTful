from django.urls import path, include
from rest_framework.routers import DefaultRouter

from catalogo.api_views import AutorViewSet, EditoraViewSet, LivroViewSet

router = DefaultRouter()
router.register(r'livros', LivroViewSet, basename='livro')
router.register(r'autores', AutorViewSet, basename='autor')
router.register(r'editoras', EditoraViewSet, basename='editora')

urlpatterns = [
    path('', include(router.urls)),
]