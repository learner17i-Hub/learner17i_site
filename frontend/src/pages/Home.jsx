import { Link } from 'react-router-dom'
import { Button, Typography, Space, Card, Row, Col } from 'antd'
import {
  ReadOutlined, SolutionOutlined, MessageOutlined, GithubOutlined, ArrowRightOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const features = [
  {
    icon: <ReadOutlined style={{ fontSize: 36, color: '#1677ff' }} />,
    title: '博客',
    desc: '记录技术学习笔记与生活感悟',
    link: '/blog',
  },
  {
    icon: <SolutionOutlined style={{ fontSize: 36, color: '#52c41a' }} />,
    title: '简历',
    desc: '查看我的教育经历、项目经验与技能',
    link: '/resume',
  },
  {
    icon: <MessageOutlined style={{ fontSize: 36, color: '#722ed1' }} />,
    title: '聊天室',
    desc: '加入在线聊天室，和大家实时交流',
    link: '/chat',
  },
  {
    icon: <GithubOutlined style={{ fontSize: 36, color: '#333' }} />,
    title: 'GitHub',
    desc: '浏览我的开源项目与代码仓库',
    link: 'https://github.com/learner17i-Hub',
    external: true,
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '100px 24px 80px',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <Title level={1} className="fade-up" style={{ fontSize: 56, marginBottom: 16, fontWeight: 800, letterSpacing: '-1px', background: 'linear-gradient(90deg, #1677ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Learner17i
          </Title>
          <Paragraph className="fade-up delay-1" style={{ color: '#555', fontSize: 22, marginBottom: 40, fontWeight: 500 }}>
            全栈开发者 &middot; 持续学习者 &middot; 开源爱好者
          </Paragraph>
          <Space size="large" className="fade-up delay-2">
            <Link to="/blog">
              <Button type="primary" size="large" icon={<ReadOutlined />} style={{ borderRadius: '12px', padding: '0 32px', height: '48px', fontSize: '16px', boxShadow: '0 8px 20px -8px #1677ff' }}>
                浏览博客
              </Button>
            </Link>
            <Button
              size="large" icon={<GithubOutlined />}
              onClick={() => window.open('https://github.com/learner17i-Hub', '_blank')}
              style={{ borderRadius: '12px', padding: '0 32px', height: '48px', fontSize: '16px', background: 'rgba(255,255,255,0.8)' }}
            >
              GitHub
            </Button>
          </Space>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>
        <Title level={2} className="fade-up delay-3" style={{ textAlign: 'center', marginBottom: 48, fontWeight: 700 }}>
          站点导航
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((f, index) => (
            <Col xs={24} sm={12} key={f.title}>
              {f.external ? (
                <a href={f.link} target="_blank" rel="noopener noreferrer">
                  <FeatureCard {...f} index={index} />
                </a>
              ) : (
                <Link to={f.link}>
                  <FeatureCard {...f} index={index} />
                </Link>
              )}
            </Col>
          ))}
        </Row>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc, index }) {
  const delayClass = `delay-${(index % 4) + 1}`;
  return (
    <Card
      bordered={false}
      className={`glass-panel hover-lift fade-up ${delayClass}`}
      style={{ height: '100%', textAlign: 'center' }}
      styles={{ body: { padding: '40px 24px' } }}
    >
      <div style={{ marginBottom: 20 }}>{icon}</div>
      <Title level={4} style={{ marginBottom: 12 }}>{title}</Title>
      <Paragraph style={{ color: '#666' }}>{desc}</Paragraph>
      <ArrowRightOutlined style={{ color: '#1677ff', fontSize: '18px', marginTop: 8 }} />
    </Card>
  )
}
