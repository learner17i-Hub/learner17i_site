import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Button, Input, Typography, List, Modal, message, Space, Tag, Empty } from 'antd'
import { PlusOutlined, LoginOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons'
import api from '../api'

const { Title, Text } = Typography

export default function ChatLobby({ user }) {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [createModal, setCreateModal] = useState(false)
  const [joinModal, setJoinModal] = useState(false)
  const [newRoom, setNewRoom] = useState({ name: '', password: '' })
  const [joinData, setJoinData] = useState({ room_name: '', password: '' })

  useEffect(() => {
    if (!user) return
    fetchRooms()
  }, [user])

  const fetchRooms = () => {
    api.get('/chat/rooms/')
      .then(r => setRooms(r.data))
      .finally(() => setLoading(false))
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Title level={3}>请先登录以使用聊天室</Title>
        <Link to="/login"><Button type="primary" size="large">去登录</Button></Link>
      </div>
    )
  }

  const handleCreate = async () => {
    if (!newRoom.name.trim()) { message.warning('请输入房间名称'); return }
    try {
      const res = await api.post('/chat/rooms/create/', newRoom)
      message.success('创建成功')
      setCreateModal(false)
      setNewRoom({ name: '', password: '' })
      navigate(`/chat/${res.data.room_name}`)
    } catch (err) {
      message.error(err.response?.data?.error || '创建失败')
    }
  }

  const handleJoin = async () => {
    if (!joinData.room_name.trim()) { message.warning('请输入房间名称'); return }
    try {
      const res = await api.post('/chat/rooms/join/', joinData)
      message.success('加入成功')
      setJoinModal(false)
      setJoinData({ room_name: '', password: '' })
      navigate(`/chat/${res.data.room_name}`)
    } catch (err) {
      message.error(err.response?.data?.error || '加入失败')
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>聊天室大厅</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModal(true)}>
            创建房间
          </Button>
          <Button icon={<LoginOutlined />} onClick={() => setJoinModal(true)}>
            加入房间
          </Button>
        </Space>
      </div>

      {rooms.length === 0 && !loading ? (
        <Empty description="你还没有加入任何聊天室，创建一个或加入已有房间吧" />
      ) : (
        <List
          loading={loading}
          dataSource={rooms}
          renderItem={room => (
            <List.Item>
              <Card
                hoverable style={{ width: '100%' }}
                onClick={() => navigate(`/chat/${room.name}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Title level={5} style={{ marginBottom: 4 }}>
                      {room.name}
                      {room.has_password && <LockOutlined style={{ marginLeft: 8, color: '#999' }} />}
                    </Title>
                    <Text type="secondary">{room.description || '暂无简介'}</Text>
                  </div>
                  <Space>
                    <Tag><TeamOutlined /> {room.member_count} 人</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      创建者: {room.creator_name}
                    </Text>
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Create Room Modal */}
      <Modal title="创建聊天室" open={createModal} onOk={handleCreate}
             onCancel={() => setCreateModal(false)} okText="创建" cancelText="取消">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="房间名称" value={newRoom.name}
                 onChange={e => setNewRoom({ ...newRoom, name: e.target.value })} />
          <Input.Password placeholder="设置密码 (可选)" value={newRoom.password}
                          onChange={e => setNewRoom({ ...newRoom, password: e.target.value })} />
        </Space>
      </Modal>

      {/* Join Room Modal */}
      <Modal title="加入聊天室" open={joinModal} onOk={handleJoin}
             onCancel={() => setJoinModal(false)} okText="加入" cancelText="取消">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="房间名称" value={joinData.room_name}
                 onChange={e => setJoinData({ ...joinData, room_name: e.target.value })} />
          <Input.Password placeholder="密码 (如果有)" value={joinData.password}
                          onChange={e => setJoinData({ ...joinData, password: e.target.value })} />
        </Space>
      </Modal>
    </div>
  )
}
