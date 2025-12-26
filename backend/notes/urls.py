from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, UserViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]

