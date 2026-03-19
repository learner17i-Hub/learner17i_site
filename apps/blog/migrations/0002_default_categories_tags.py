from django.db import migrations


def create_default_categories_and_tags(apps, schema_editor):
    Category = apps.get_model('blog', 'Category')
    Tag = apps.get_model('blog', 'Tag')

    default_categories = ['技术', '学习', '生活', '随笔', '阅读']
    default_tags = ['Python', 'Django', 'React', '前端', '后端', '笔记', '随想']

    for name in default_categories:
        Category.objects.get_or_create(name=name)

    for name in default_tags:
        Tag.objects.get_or_create(name=name)


def remove_default_categories_and_tags(apps, schema_editor):
    Category = apps.get_model('blog', 'Category')
    Tag = apps.get_model('blog', 'Tag')

    default_categories = ['技术', '学习', '生活', '随笔', '阅读']
    default_tags = ['Python', 'Django', 'React', '前端', '后端', '笔记', '随想']

    # 只删除没有文章关联的默认分类/标签，避免误删用户真实数据
    Category.objects.filter(name__in=default_categories, posts__isnull=True).delete()
    Tag.objects.filter(name__in=default_tags, posts__isnull=True).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_categories_and_tags, remove_default_categories_and_tags),
    ]

