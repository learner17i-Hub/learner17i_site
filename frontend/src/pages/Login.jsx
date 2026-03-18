import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Input, Button, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import api from '../api'

const { Title, Text } = Typography

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      message.warning('请填写用户名和密码')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/accounts/login/', { username, password })
      setUser(res.data)
      message.success('登录成功')
      navigate('/chat')
    } catch (err) {
      message.error(err.response?.data?.error || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 130px)', padding: 24,
    }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>登录</Title>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            size="large"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Button type="primary" block size="large" loading={loading} onClick={handleLogin}>
            登录
          </Button>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">还没有账号？</Text>
            <Link to="/register">立即注册</Link>
          </div>
        </Space>
      </Card>
    </div>
  )
}
