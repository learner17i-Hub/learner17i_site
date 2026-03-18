import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Input, Button, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import api from '../api'

const { Title, Text } = Typography

export default function Register({ setUser }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!username || !password) {
      message.warning('请填写用户名和密码')
      return
    }
    if (password !== confirm) {
      message.warning('两次输入的密码不一致')
      return
    }
    if (password.length < 6) {
      message.warning('密码长度至少6位')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/accounts/register/', { username, password })
      setUser(res.data)
      message.success('注册成功')
      navigate('/chat')
    } catch (err) {
      message.error(err.response?.data?.error || '注册失败')
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
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>注册</Title>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码 (至少6位)"
            size="large"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="确认密码"
            size="large"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onPressEnter={handleRegister}
          />
          <Button type="primary" block size="large" loading={loading} onClick={handleRegister}>
            注册
          </Button>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">已有账号？</Text>
            <Link to="/login">去登录</Link>
          </div>
        </Space>
      </Card>
    </div>
  )
}
