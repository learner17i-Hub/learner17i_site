from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Post, Category, Tag, Comment
from .serializers import (
    PostListSerializer, PostDetailSerializer,
    CategorySerializer, TagSerializer, CommentSerializer,
)


class PostListView(generics.ListAPIView):
    serializer_class = PostListSerializer

    def get_queryset(self):
        qs = Post.objects.filter(is_published=True)
        category = self.request.query_params.get('category')
        tag = self.request.query_params.get('tag')
        search = self.request.query_params.get('search')
        if category:
            qs = qs.filter(category__name=category)
        if tag:
            qs = qs.filter(tags__name=tag)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(content__icontains=search))
        return qs.distinct()


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    queryset = Post.objects.filter(is_published=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    pagination_class = None


class TagListView(generics.ListAPIView):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
    pagination_class = None


class CommentCreateView(APIView):
    def post(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id, is_published=True)
        except Post.DoesNotExist:
            return Response({'error': '文章不存在'}, status=status.HTTP_404_NOT_FOUND)

        author_name = request.data.get('author_name', '').strip()
        content = request.data.get('content', '').strip()
        parent_id = request.data.get('parent')

        if not author_name or not content:
            return Response({'error': '昵称和内容不能为空'}, status=status.HTTP_400_BAD_REQUEST)

        parent = None
        if parent_id:
            try:
                parent = Comment.objects.get(pk=parent_id, post=post)
            except Comment.DoesNotExist:
                pass

        comment = Comment.objects.create(
            post=post, author_name=author_name, content=content, parent=parent
        )
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
