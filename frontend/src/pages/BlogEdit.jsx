import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Switch, Select, Upload, message, Typography, Card, Row, Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import api from '../api'

const { Title } = Typography

export default function BlogEdit({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(!!id)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [previewContent, setPreviewContent] = useState('')

  useEffect(() => {
    if (!user || !user.is_staff) {
      message.error('权限不足，仅管理员可访问')
      navigate('/login')
      return
    }
    
    // Fetch categories and tags
    api.get('/blog/categories/').then(r => setCategories(r.data))
    api.get('/blog/tags/').then(r => setTags(r.data))

    if (id) {
      api.get(`/blog/posts/${id}/`).then(r => {
        form.setFieldsValue({
          title: r.data.title,
          summary: r.data.summary,
          content: r.data.content,
          is_published: r.data.is_published,
          category_id: r.data.category?.id,
          tag_ids: r.data.tags?.map(t => t.id) || [],
        })
        setPreviewContent(r.data.content)
      }).finally(() => setLoading(false))
    }
  }, [id, user])

  const onFinish = async (values) => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('summary', values.summary || '')
      formData.append('content', values.content)
      formData.append('is_published', values.is_published)
      
      if (values.category_id) formData.append('category_id', values.category_id)
      if (values.tag_ids && values.tag_ids.length > 0) {
        values.tag_ids.forEach(t => formData.append('tag_ids', t))
      }

      if (values.cover?.file?.originFileObj) {
        formData.append('cover', values.cover.file.originFileObj)
      }

      if (id) {
        await api.patch(`/blog/posts/${id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        message.success('更新成功')
        navigate(`/blog/${id}`)
      } else {
        const res = await api.post('/blog/posts/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        message.success('发布成功')
        navigate(`/blog/${res.data.id}`)
      }
    } catch (e) {
      console.error(e)
      message.error('保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>加载中...</div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <Title level={2}>{id ? '编辑文章' : '写新文章'}</Title>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card title="编辑区" bordered={false} className="glass-panel">
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ is_published: true }}>
              <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="文章标题" />
              </Form.Item>

              <Form.Item name="summary" label="摘要">
                <Input.TextArea rows={2} placeholder="简单描述文章内容" />
              </Form.Item>

              <Form.Item name="content" label="内容 (Markdown)" rules={[{ required: true, message: '请输入正文' }]}>
                <Input.TextArea 
                  rows={15} 
                  placeholder="支持 Markdown 语法" 
                  onChange={(e) => setPreviewContent(e.target.value)}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="category_id" label="分类">
                    <Select placeholder="选择分类" allowClear>
                      {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="tag_ids" label="标签">
                    <Select mode="multiple" placeholder="选择标签" allowClear>
                      {tags.map(t => <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="cover" label="封面图片 (可选)">
                <Upload beforeUpload={() => false} maxCount={1} accept="image/*" listType="picture">
                  <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>
              </Form.Item>

              <Form.Item name="is_published" label="立即发布" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting} block size="large">
                  {id ? '保存更新' : '发布文章'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="预览区" bordered={false} className="glass-panel" style={{ height: '100%', minHeight: 600 }}>
            <div className="markdown-body">
              {previewContent ? <ReactMarkdown>{previewContent}</ReactMarkdown> : <div style={{color: '#999'}}>正文预览...</div>}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
