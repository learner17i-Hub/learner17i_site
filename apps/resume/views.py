from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import ResumeData

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

DEFAULT_RESUME = {
    'name': 'Learner17i',
    'title': '全栈开发者',
    'avatar': '',
    'bio': '热爱编程，持续学习中。',
    'contact': {
        'email': 'learner17i@example.com',
        'github': 'https://github.com/learner17i-Hub',
    },
    'education': [
        {
            'school': '某某大学',
            'major': '计算机科学与技术',
            'degree': '本科',
            'start': '2022-09',
            'end': '2026-06',
            'description': '主修课程：数据结构、操作系统、数据库原理、计算机网络等。',
        },
    ],
    'experience': [
        {
            'company': 'OurChat 项目',
            'role': '全栈开发',
            'start': '2025-10',
            'end': '2025-12',
            'description': '使用 Django + PostgreSQL 开发了一个多功能聊天室应用，支持房间创建、文件传输、成员管理等功能。',
        },
    ],
    'projects': [
        {
            'name': 'OurChat 聊天室',
            'description': '基于 Django 的 Web 聊天应用，支持多房间、文件传输、实时消息。',
            'tech': ['Django', 'PostgreSQL', 'JavaScript', 'HTML/CSS'],
            'link': 'https://github.com/learner17i-Hub/ourchat',
        },
        {
            'name': 'Learner17i 个人网站',
            'description': '使用 Django + React 构建的个人全栈网站，包含博客、简历、聊天室等功能。',
            'tech': ['Django', 'React', 'Django REST Framework', 'Ant Design'],
            'link': 'https://github.com/learner17i-Hub',
        },
    ],
    'skills': [
        {'name': 'Python', 'level': 85},
        {'name': 'Django', 'level': 80},
        {'name': 'JavaScript', 'level': 75},
        {'name': 'React', 'level': 70},
        {'name': 'HTML/CSS', 'level': 80},
        {'name': 'SQL', 'level': 75},
        {'name': 'Git', 'level': 70},
    ],
}

class ResumeView(APIView):
    """返回或更新个人简历数据"""
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        resume = ResumeData.objects.first()
        if resume and resume.data:
            return Response(resume.data)
        return Response(DEFAULT_RESUME)

    def post(self, request):
        resume = ResumeData.objects.first()
        if not resume:
            resume = ResumeData()
        
        resume.data = request.data
        resume.save()
        
        return Response(resume.data, status=status.HTTP_200_OK)
