from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='分类名')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = '分类'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='标签名')

    class Meta:
        verbose_name = '标签'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name='标题')
    summary = models.TextField(max_length=500, blank=True, verbose_name='摘要')
    content = models.TextField(verbose_name='内容(Markdown)')
    cover = models.ImageField(upload_to='blog/covers/%Y/%m/', blank=True, null=True, verbose_name='封面图')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='posts', verbose_name='分类')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts', verbose_name='标签')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts', verbose_name='作者')
    views = models.PositiveIntegerField(default=0, verbose_name='浏览量')
    is_published = models.BooleanField(default=True, verbose_name='已发布')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '文章'
        verbose_name_plural = verbose_name
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', verbose_name='文章')
    author_name = models.CharField(max_length=50, verbose_name='昵称')
    content = models.TextField(max_length=1000, verbose_name='评论内容')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True,
                               related_name='replies', verbose_name='父评论')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='评论时间')

    class Meta:
        verbose_name = '评论'
        verbose_name_plural = verbose_name
        ordering = ['created_at']

    def __str__(self):
        return f'{self.author_name}: {self.content[:30]}'
