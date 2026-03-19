from django.contrib import admin
from .models import WeightRecord

@admin.register(WeightRecord)
class WeightRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'weight', 'created_at')
    list_filter = ('user', 'date')
    search_fields = ('activity',)
