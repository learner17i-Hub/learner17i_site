from rest_framework import serializers
from .models import WeightRecord, WeightRecordImage

class WeightRecordImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightRecordImage
        fields = ['id', 'image']

class WeightRecordSerializer(serializers.ModelSerializer):
    images = WeightRecordImageSerializer(many=True, read_only=True)

    class Meta:
        model = WeightRecord
        fields = ['id', 'user', 'date', 'weight', 'activity', 'images', 'created_at']
        read_only_fields = ['user', 'created_at']
