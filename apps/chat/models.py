from django.db import models
from django.contrib.auth.models import User


class ChatRoom(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='聊天室名称')
    description = models.TextField(blank=True, verbose_name='聊天室简介')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_rooms', verbose_name='群主')
    room_password = models.CharField(max_length=50, blank=True, verbose_name='进入密码')
    members = models.ManyToManyField(User, related_name='joined_rooms', blank=True, verbose_name='成员')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '聊天室'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='chat_files/%Y/%m/%d/', blank=True, null=True, verbose_name='文件/图片')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        preview = self.content[:20] if self.content else '[文件]'
        return f'[{self.sender.username}] {preview}'
