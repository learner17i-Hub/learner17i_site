import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, Tag, Input, Space, Select, Typography, Pagination, Spin, Empty, Row, Col, Button } from 'antd'
import { EyeOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import api from '../api'

const { Title, Paragraph, Text } = Typography

export default function BlogList({ user }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category') || ''
  const tag = searchParams.get('tag') || ''

  useEffect(() => {
    api.get('/blog/categories/').then(r => setCategories(r.data))
    api.get('/blog/tags/').then(r => setTags(r.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page }
    if (category) params.category = category
    if (tag) params.tag = tag
    if (searchParams.get('search')) params.search = searchParams.get('search')

    api.get('/blog/posts/', { params })
      .then(r => {
        setPosts(r.data.results)
        setTotal(r.data.count)
      })
      .finally(() => setLoading(false))
  }, [page, category, tag, searchParams])

  const updateParams = (updates) => {
    const p = Object.fromEntries(searchParams)
    Object.assign(p, updates)
    Object.keys(p).forEach(k => { if (!p[k]) delete p[k] })
    if (updates.page === undefined) delete p.page
    setSearchParams(p)
  }

  const handleSearch = () => {
    updateParams({ search, page: undefined })
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>博客</Title>
        {user?.is_staff && (
          <Link to="/blog/new">
            <Button type="primary">写新文章</Button>
          </Link>
        )}
      </div>
      <br/>
      {/* Filters */}
      <Space wrap style={{ marginBottom: 24 }}>
        <Input.Search
          placeholder="搜索文章..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 240 }}
          enterButton={<SearchOutlined />}
        />
        <Select
          placeholder="分类筛选"
          allowClear
          value={category || undefined}
          onChange={v => updateParams({ category: v || '', page: undefined })}
          style={{ width: 140 }}
          options={categories.map(c => ({ value: c.name, label: `${c.name} (${c.post_count})` }))}
        />
        <Select
          placeholder="标签筛选"
          allowClear
          value={tag || undefined}
          onChange={v => updateParams({ tag: v || '', page: undefined })}
          style={{ width: 140 }}
          options={tags.map(t => ({ value: t.name, label: `${t.name} (${t.post_count})` }))}
        />
      </Space>

      {/* Post List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      ) : posts.length === 0 ? (
        <Empty description="暂无文章" />
      ) : (
        <>
          <Row gutter={[0, 16]}>
            {posts.map(post => (
              <Col span={24} key={post.id}>
                <Link to={`/blog/${post.id}`}>
                  <Card hoverable>
                    <Title level={4} style={{ marginBottom: 8 }}>{post.title}</Title>
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                      {post.summary || '暂无摘要'}
                    </Paragraph>
                    <Space split={<Text type="secondary">·</Text>}>
                      {post.category_name && <Tag color="blue">{post.category_name}</Tag>}
                      {post.tags?.map(t => <Tag key={t.id}>{t.name}</Tag>)}
                      <Text type="secondary"><CalendarOutlined /> {new Date(post.created_at).toLocaleDateString()}</Text>
                      <Text type="secondary"><EyeOutlined /> {post.views}</Text>
                    </Space>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          {total > 10 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={page} total={total} pageSize={10}
                onChange={p => updateParams({ page: p.toString() })}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
