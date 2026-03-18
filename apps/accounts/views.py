from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token


class CSRFTokenView(APIView):
    def get(self, request):
        return Response({'csrfToken': get_token(request)})


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response({'error': '用户名和密码不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 6:
            return Response({'error': '密码长度至少6位'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': '该用户名已被注册'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return Response({
            'id': user.id,
            'username': user.username,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'error': '用户名或密码错误'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        return Response({
            'id': user.id,
            'username': user.username,
        })


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': '已退出登录'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
        })
