import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Input, Button, Typography, Spin, message, Space, Card, Upload, Tag, List, Avatar } from 'antd'
import {
  SendOutlined, ArrowLeftOutlined, PaperClipOutlined,
  TeamOutlined, HistoryOutlined, UserOutlined,
} from '@ant-design/icons'
import api from '../api'

const { Title, Text } = Typography

export default function ChatRoom({ user }) {
  const { roomName } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [members, setMembers] = useState([])
  const [showMembers, setShowMembers] = useState(false)
  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }

    api.get(`/chat/rooms/${roomName}/messages/`)
      .then(r => {
        setMessages(r.data.messages)
        setHasMore(r.data.messages.length >= 30)
        setLoading(false)
        setTimeout(scrollToBottom, 100)
      })
      .catch(() => {
        message.error('\u65e0\u6cd5\u52a0\u8f7d\u804a\u5929\u5ba4')
        navigate('/chat')
      })

    pollingRef.current = setInterval(() => pollMessages(), 3000)
    return () => clearInterval(pollingRef.current)
  }, [roomName, user])

  const messagesRef = useRef(messages)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const pollMessages = useCallback(() => {
    const prev = messagesRef.current
    const lastId = prev.length > 0 ? prev[prev.length - 1].id : 0

    api.get(`/chat/rooms/${roomName}/messages/`, { params: { last_id: lastId } })
      .then(r => {
        if (r.data.messages && r.data.messages.length > 0) {
          const existingIds = new Set(prev.map(m => m.id))
          const newMsgs = r.data.messages.filter(m => !existingIds.has(m.id))
          
          if (newMsgs.length > 0) {
            setMessages(p => [...p, ...newMsgs])
            // Only scroll to bottom if new messages actually arrived
            setTimeout(scrollToBottom, 100)
          }
        }
      })
  }, [roomName])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return
    setSending(true)
    try {
      const form = new FormData()
      form.append('content', text)
      const res = await api.post(`/chat/rooms/${roomName}/send/`, form)
      setMessages(prev => [...prev, res.data])
      setInput('')
      setTimeout(scrollToBottom, 100)
    } catch {
      message.error('\u53d1\u9001\u5931\u8d25')
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (file) => {
    const form = new FormData()
    form.append('file', file)
    form.append('content', '')
    try {
      const res = await api.post(`/chat/rooms/${roomName}/send/`, form)
      setMessages(prev => [...prev, res.data])
      setTimeout(scrollToBottom, 100)
    } catch {
      message.error('\u6587\u4ef6\u53d1\u9001\u5931\u8d25')
    }
    return false
  }

  const loadHistory = async () => {
    if (messages.length === 0) return
    setLoadingHistory(true)
    try {
      const firstId = messages[0].id
      const res = await api.get(`/chat/rooms/${roomName}/history/`, { params: { first_id: firstId } })
      setMessages(prev => [...res.data.messages, ...prev])
      setHasMore(res.data.has_more)
    } catch {
      message.error('\u52a0\u8f7d\u5386\u53f2\u6d88\u606f\u5931\u8d25')
    } finally {
      setLoadingHistory(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/chat/rooms/${roomName}/members/`)
      setMembers(res.data.members)
      setShowMembers(true)
    } catch {
      message.error('\u83b7\u53d6\u6210\u5458\u5217\u8868\u5931\u8d25')
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Space>
          <Link to="/chat"><Button icon={<ArrowLeftOutlined />} type="text" /></Link>
          <Title level={4} style={{ margin: 0 }}>{roomName}</Title>
        </Space>
        <Button icon={<TeamOutlined />} onClick={fetchMembers}>{'\u6210\u5458'}</Button>
      </div>

      {/* Messages Area */}
      <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', marginBottom: 12, padding: 16 }}>
        {hasMore && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <Button size="small" icon={<HistoryOutlined />} loading={loadingHistory} onClick={loadHistory}>
              {'\u52a0\u8f7d\u66f4\u65e9\u6d88\u606f'}
            </Button>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex', justifyContent: msg.is_my_msg ? 'flex-end' : 'flex-start',
            marginBottom: 12,
          }}>
            <div style={{ maxWidth: '70%' }}>
              {!msg.is_my_msg && (
                <Text strong style={{ fontSize: 12, color: '#1677ff', display: 'block', marginBottom: 2 }}>
                  {msg.sender}
                </Text>
              )}
              <div style={{
                background: msg.is_my_msg ? '#1677ff' : '#fff',
                color: msg.is_my_msg ? '#fff' : '#333',
                padding: '8px 14px', borderRadius: 12,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordBreak: 'break-word',
              }}>
                {msg.content && <div>{msg.content}</div>}
                {msg.file_url && (
                  <div style={{ marginTop: msg.content ? 8 : 0 }}>
                    {isImage(msg.file_name) ? (
                      <img src={msg.file_url} alt={msg.file_name}
                           style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
                    ) : (
                      <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
                         style={{ color: msg.is_my_msg ? '#e6f4ff' : '#1677ff' }}>
                        <PaperClipOutlined /> {msg.file_name}
                      </a>
                    )}
                  </div>
                )}
              </div>
              <Text type="secondary" style={{ fontSize: 11, marginTop: 2, display: 'block',
                textAlign: msg.is_my_msg ? 'right' : 'left' }}>
                {msg.formatted_timestamp || msg.timestamp}
              </Text>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Upload beforeUpload={handleFileUpload} showUploadList={false}>
          <Button icon={<PaperClipOutlined />} />
        </Upload>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={sendMessage}
          placeholder={'\u8f93\u5165\u6d88\u606f...'}
          size="large"
        />
        <Button type="primary" icon={<SendOutlined />} size="large"
                loading={sending} onClick={sendMessage}>
          {'\u53d1\u9001'}
        </Button>
      </div>

      {/* Members drawer */}
      {showMembers && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 280,
          background: '#fff', boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
          zIndex: 1001, padding: 24, overflow: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0 }}>{'\u6210\u5458\u5217\u8868'} ({members.length})</Title>
            <Button type="text" onClick={() => setShowMembers(false)}>{'\u5173\u95ed'}</Button>
          </div>
          <List
            dataSource={members}
            renderItem={m => (
              <List.Item>
                <Space>
                  <Avatar icon={<UserOutlined />} size="small" />
                  <Text>{m.username}</Text>
                  {m.is_creator && <Tag color="gold">{'\u7fa4\u4e3b'}</Tag>}
                  {m.is_me && <Tag color="blue">{'\u6211'}</Tag>}
                </Space>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  )
}

function isImage(filename) {
  if (!filename) return false
  const ext = filename.toLowerCase().split('.').pop()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)
}
