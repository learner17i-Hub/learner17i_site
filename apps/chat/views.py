from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer


class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rooms = request.user.joined_rooms.all().order_by('-created_at')
        serializer = ChatRoomSerializer(rooms, many=True)
        return Response(serializer.data)


class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get('name', '').strip()
        password = request.data.get('password', '')
        description = request.data.get('description', '')

        if not name:
            return Response({'error': '\u623f\u95f4\u540d\u4e0d\u80fd\u4e3a\u7a7a'}, status=status.HTTP_400_BAD_REQUEST)
        if ChatRoom.objects.filter(name=name).exists():
            return Response({'error': '\u8be5\u623f\u95f4\u540d\u5df2\u88ab\u5360\u7528'}, status=status.HTTP_400_BAD_REQUEST)

        room = ChatRoom.objects.create(
            name=name, creator=request.user,
            room_password=password, description=description
        )
        room.members.add(request.user)
        return Response({'room_name': room.name}, status=status.HTTP_201_CREATED)


class JoinRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_name = request.data.get('room_name', '').strip()
        password = request.data.get('password', '')

        try:
            room = ChatRoom.objects.get(name=room_name)
        except ChatRoom.DoesNotExist:
            return Response({'error': f'\u672a\u627e\u5230 "{room_name}" \u804a\u5929\u5ba4'}, status=status.HTTP_404_NOT_FOUND)

        if request.user in room.members.all():
            return Response({'room_name': room.name})

        if room.room_password and room.room_password != password:
            return Response({'error': '\u5bc6\u7801\u9519\u8bef'}, status=status.HTTP_403_FORBIDDEN)

        room.members.add(request.user)
        return Response({'room_name': room.name})


class RoomMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_name):
        room = get_object_or_404(ChatRoom, name=room_name)
        if request.user not in room.members.all():
            return Response({'error': '\u4f60\u4e0d\u662f\u8be5\u623f\u95f4\u6210\u5458'}, status=status.HTTP_403_FORBIDDEN)

        last_id = int(request.query_params.get('last_id', 0))
        if last_id:
            messages = Message.objects.filter(room=room, id__gt=last_id).order_by('timestamp')
        else:
            recent = Message.objects.filter(room=room).order_by('-timestamp')[:30]
            messages = list(reversed(recent))

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response({
            'messages': serializer.data,
            'room_id': room.id,
            'room_name': room.name,
        })


class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, room_name):
        room = get_object_or_404(ChatRoom, name=room_name)
        if request.user not in room.members.all():
            return Response({'error': '\u4f60\u4e0d\u662f\u8be5\u623f\u95f4\u6210\u5458'}, status=status.HTTP_403_FORBIDDEN)

        content = request.data.get('content', '').strip()
        uploaded_file = request.FILES.get('file')

        if not content and not uploaded_file:
            return Response({'error': '\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a'}, status=status.HTTP_400_BAD_REQUEST)

        msg = Message.objects.create(
            room=room, sender=request.user,
            content=content, file=uploaded_file,
        )
        serializer = MessageSerializer(msg, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class HistoryMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_name):
        room = get_object_or_404(ChatRoom, name=room_name)
        if request.user not in room.members.all():
            return Response({'error': '\u4f60\u4e0d\u662f\u8be5\u623f\u95f4\u6210\u5458'}, status=status.HTTP_403_FORBIDDEN)

        first_id = int(request.query_params.get('first_id', 0))
        limit = 30

        qs = Message.objects.filter(room=room, id__lt=first_id).order_by('-timestamp')[:limit + 1]
        msg_list = list(qs)

        has_more = len(msg_list) > limit
        msgs = list(reversed(msg_list[:limit]))

        serializer = MessageSerializer(msgs, many=True, context={'request': request})
        return Response({'messages': serializer.data, 'has_more': has_more})


class RoomMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_name):
        room = get_object_or_404(ChatRoom, name=room_name)
        if request.user not in room.members.all():
            return Response({'error': '\u4f60\u4e0d\u662f\u8be5\u623f\u95f4\u6210\u5458'}, status=status.HTTP_403_FORBIDDEN)

        members = []
        for m in room.members.all():
            members.append({
                'id': m.id,
                'username': m.username,
                'is_creator': m == room.creator,
                'is_me': m == request.user,
            })
        members.sort(key=lambda x: (not x['is_creator'], x['username']))
        return Response({'members': members, 'total': len(members)})
