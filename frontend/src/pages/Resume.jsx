import { useState, useEffect } from 'react'
import { Typography, Card, Tag, Timeline, Progress, Spin, Space, Row, Col, Divider } from 'antd'
import {
  BookOutlined, ProjectOutlined, ToolOutlined, GithubOutlined,
  MailOutlined, TrophyOutlined, CalendarOutlined,
} from '@ant-design/icons'
import api from '../api'

const { Title, Paragraph, Text, Link: AntLink } = Typography

export default function Resume() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/resume/')
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
  if (!data) return null

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: 4 }}>{data.name}</Title>
        <Paragraph type="secondary" style={{ fontSize: 18, marginBottom: 16 }}>{data.title}</Paragraph>
        <Paragraph>{data.bio}</Paragraph>
        <Space size="large">
          {data.contact?.email && (
            <AntLink href={`mailto:${data.contact.email}`}>
              <MailOutlined /> {data.contact.email}
            </AntLink>
          )}
          {data.contact?.github && (
            <AntLink href={data.contact.github} target="_blank">
              <GithubOutlined /> GitHub
            </AntLink>
          )}
        </Space>
      </Card>

      <Row gutter={32}>
        <Col xs={24} md={16}>
          {/* Education */}
          <Title level={3}><BookOutlined /> 教育经历</Title>
          <Timeline style={{ marginTop: 16, marginBottom: 32 }}
            items={data.education?.map(edu => ({
              children: (
                <Card size="small">
                  <Title level={5} style={{ marginBottom: 4 }}>{edu.school}</Title>
                  <Text>{edu.major} · {edu.degree}</Text>
                  <br />
                  <Text type="secondary"><CalendarOutlined /> {edu.start} ~ {edu.end}</Text>
                  {edu.description && <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>{edu.description}</Paragraph>}
                </Card>
              ),
            }))}
          />

          {/* Experience */}
          {data.experience?.length > 0 && (
            <>
              <Title level={3}><TrophyOutlined /> 工作/实践经历</Title>
              <Timeline style={{ marginTop: 16, marginBottom: 32 }}
                items={data.experience.map(exp => ({
                  children: (
                    <Card size="small">
                      <Title level={5} style={{ marginBottom: 4 }}>{exp.company}</Title>
                      <Text>{exp.role}</Text>
                      <br />
                      <Text type="secondary"><CalendarOutlined /> {exp.start} ~ {exp.end}</Text>
                      {exp.description && <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>{exp.description}</Paragraph>}
                    </Card>
                  ),
                }))}
              />
            </>
          )}

          {/* Projects */}
          <Title level={3}><ProjectOutlined /> 项目经历</Title>
          <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 32 }}>
            {data.projects?.map((proj, i) => (
              <Col span={24} key={i}>
                <Card size="small">
                  <Title level={5} style={{ marginBottom: 4 }}>{proj.name}</Title>
                  <Paragraph style={{ marginBottom: 8 }}>{proj.description}</Paragraph>
                  <Space wrap>
                    {proj.tech?.map(t => <Tag key={t} color="blue">{t}</Tag>)}
                  </Space>
                  {proj.link && (
                    <div style={{ marginTop: 8 }}>
                      <AntLink href={proj.link} target="_blank"><GithubOutlined /> 查看项目</AntLink>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={24} md={8}>
          {/* Skills */}
          <Title level={3}><ToolOutlined /> 技能</Title>
          <Card style={{ marginTop: 16 }}>
            {data.skills?.map(skill => (
              <div key={skill.name} style={{ marginBottom: 16 }}>
                <Text>{skill.name}</Text>
                <Progress percent={skill.level} size="small" strokeColor="#1677ff" />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
