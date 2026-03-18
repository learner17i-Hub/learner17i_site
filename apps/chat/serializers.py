from rest_framework import serializers
from .models import ChatRoom, Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)
    is_my_msg = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'formatted_timestamp', 'is_my_msg', 'file_url', 'file_name']

    def get_is_my_msg(self, obj):
        request = self.context.get('request')
        return request and obj.sender == request.user

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None

    def get_file_name(self, obj):
        if obj.file:
            return obj.file.name.split('/')[-1]
        return ''

    def get_formatted_timestamp(self, obj):
        return obj.timestamp.strftime("%Y-%m-%d %H:%M:%S")


class ChatRoomSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.username', read_only=True)
    member_count = serializers.IntegerField(source='members.count', read_only=True)
    has_password = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'description', 'creator_name', 'member_count',
                  'has_password', 'created_at']

    def get_has_password(self, obj):
        return bool(obj.room_password)


class RoomMemberSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    is_creator = serializers.BooleanField()
    is_me = serializers.BooleanField()
