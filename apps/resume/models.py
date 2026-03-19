from django.db import models

class ResumeData(models.Model):
    data = models.JSONField(default=dict, verbose_name="简历数据")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "简历数据"
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"Resume Data (updated {self.updated_at.strftime('%Y-%m-%d %H:%M')})"
