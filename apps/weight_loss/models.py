from django.db import models
from django.contrib.auth.models import User
import datetime

class WeightRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weight_records')
    date = models.DateField(default=datetime.date.today)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    activity = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.weight}kg"


class WeightRecordImage(models.Model):
    record = models.ForeignKey(WeightRecord, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='weight_pics/')
    
    def __str__(self):
        return f"Image for {self.record}"
