from rest_framework import viewsets, renderers
from rest_framework.permissions import IsAuthenticated
from .models import WeightRecord, WeightRecordImage
from .serializers import WeightRecordSerializer

class WeightRecordViewSet(viewsets.ModelViewSet):
    serializer_class = WeightRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return records for the logged in user
        return WeightRecord.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the logged in user as the owner of the record
        record = serializer.save(user=self.request.user)
        
        # Handle multiple images
        pictures = self.request.FILES.getlist('pictures')
        for picture in pictures:
            WeightRecordImage.objects.create(record=record, image=picture)
