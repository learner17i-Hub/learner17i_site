from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeightRecordViewSet

router = DefaultRouter()
router.register(r'records', WeightRecordViewSet, basename='weight-record')

urlpatterns = [
    path('', include(router.urls)),
]
