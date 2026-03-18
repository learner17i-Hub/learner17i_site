from rest_framework import serializers
from .models import Category, Tag, Post, Comment


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(source='posts.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'post_count']


class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(source='posts.count', read_only=True)

    class Meta:
        model = Tag
        fields = ['id', 'name', 'post_count']


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author_name', 'content', 'parent', 'created_at', 'replies']

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []


class PostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', default='', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'summary', 'cover', 'category_name',
                  'tags', 'author_name', 'views', 'created_at']


class PostDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'summary', 'content', 'cover', 'category',
                  'tags', 'author_name', 'views', 'created_at', 'updated_at', 'comments']

    def get_comments(self, obj):
        top_level = obj.comments.filter(parent__isnull=True)
        return CommentSerializer(top_level, many=True).data
