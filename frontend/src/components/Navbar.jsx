import { Link, useLocation } from 'react-router-dom'
import { Menu, Button, Space } from 'antd'
import {
  HomeOutlined, ReadOutlined, SolutionOutlined,
  MessageOutlined, GithubOutlined, UserOutlined, LogoutOutlined,
  LineChartOutlined
} from '@ant-design/icons'

const NAV_ITEMS = [
  { key: '/', label: '首页', icon: <HomeOutlined /> },
  { key: '/blog', label: '博客', icon: <ReadOutlined /> },
  { key: '/resume', label: '简历', icon: <SolutionOutlined /> },
  { key: '/chat', label: '聊天室', icon: <MessageOutlined /> },
  { key: '/weight-diary', label: '减肥日记', icon: <LineChartOutlined /> },
]

export default function Navbar({ user, onLogout }) {
  const location = useLocation()

  const current = NAV_ITEMS.find(item =>
    item.key === '/' ? location.pathname === '/' : location.pathname.startsWith(item.key)
  )?.key || '/'

  return (
    <header className="glass-navbar" style={{
      display: 'flex', alignItems: 'center',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 1000,
    }}>
      <Link to="/" style={{ color: '#222', fontSize: 22, fontWeight: 800, marginRight: 32, whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
        Learner17i
      </Link>

      <Menu
        mode="horizontal"
        selectedKeys={[current]}
        style={{ flex: 1, minWidth: 0, background: 'transparent', borderBottom: 'none', fontWeight: 500 }}
        items={NAV_ITEMS.map(item => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.key}>{item.label}</Link>,
        }))}
      />

      <Space>
        <Button
          type="text" icon={<GithubOutlined />}
          style={{ color: '#333', fontWeight: 500 }}
          onClick={() => window.open('https://github.com/learner17i-Hub', '_blank')}
        >
          GitHub
        </Button>
        {user ? (
          <>
            <span style={{ color: '#1677ff', fontWeight: 500 }}>
              <UserOutlined /> {user.username}
            </span>
            <Button type="text" icon={<LogoutOutlined />} style={{ color: '#333' }} onClick={onLogout}>
              退出
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button type="primary" size="middle" style={{ borderRadius: '8px' }}>登录</Button>
          </Link>
        )}
      </Space>
    </header>
  )
}
