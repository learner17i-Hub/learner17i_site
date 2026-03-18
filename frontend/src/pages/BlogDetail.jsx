import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Typography, Tag, Spin, Card, Divider, Input, Button, List, message, Space } from 'antd'
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import api from '../api'

const { Title, Text, Paragraph } = Typography

export default function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentName, setCommentName] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchPost = () => {
    api.get(`/blog/posts/${id}/`)
      .then(r => setPost(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPost() }, [id])

  const handleComment = async () => {
    if (!commentName.trim() || !commentContent.trim()) {
      message.warning('请填写昵称和评论内容')
      return
    }
    setSubmitting(true)
    try {
      await api.post(`/blog/posts/${id}/comment/`, {
        author_name: commentName,
        content: commentContent,
      })
      message.success('评论成功')
      setCommentContent('')
      fetchPost()
    } catch {
      message.error('评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
  if (!post) return <div style={{ textAlign: 'center', padding: 80 }}>文章不存在</div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <Link to="/blog">
        <Button type="link" icon={<ArrowLeftOutlined />} style={{ paddingLeft: 0, marginBottom: 16 }}>
          返回列表
        </Button>
      </Link>

      <Title level={2}>{post.title}</Title>
      <Space style={{ marginBottom: 24 }} split={<Text type="secondary">·</Text>}>
        <Text type="secondary"><UserOutlined /> {post.author_name}</Text>
        <Text type="secondary"><CalendarOutlined /> {new Date(post.created_at).toLocaleDateString()}</Text>
        <Text type="secondary"><EyeOutlined /> {post.views} 阅读</Text>
        {post.category && <Tag color="blue">{post.category.name}</Tag>}
        {post.tags?.map(t => <Tag key={t.id}>{t.name}</Tag>)}
      </Space>

      <Card style={{ marginBottom: 32 }}>
        <div className="markdown-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </Card>

      {/* Comments */}
      <Divider>评论 ({post.comments?.length || 0})</Divider>

      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="你的昵称"
            value={commentName}
            onChange={e => setCommentName(e.target.value)}
            style={{ maxWidth: 240 }}
          />
          <Input.TextArea
            rows={3}
            placeholder="写下你的评论..."
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
          />
          <Button type="primary" onClick={handleComment} loading={submitting}>
            发表评论
          </Button>
        </Space>
      </Card>

      {post.comments?.length > 0 && (
        <List
          dataSource={post.comments}
          renderItem={comment => <CommentItem comment={comment} />}
        />
      )}
    </div>
  )
}

function CommentItem({ comment, indent = 0 }) {
  return (
    <div style={{ marginLeft: indent * 32, marginBottom: 12 }}>
      <Card size="small">
        <Space>
          <Text strong>{comment.author_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(comment.created_at).toLocaleString()}
          </Text>
        </Space>
        <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>{comment.content}</Paragraph>
      </Card>
      {comment.replies?.map(r => (
        <CommentItem key={r.id} comment={r} indent={1} />
      ))}
    </div>
  )
}
