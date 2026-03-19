import { useState, useEffect } from 'react'
import { Typography, Card, Tag, Timeline, Progress, Spin, Space, Row, Col, Divider, Button, Form, Input, InputNumber, message } from 'antd'
import {
  BookOutlined, ProjectOutlined, ToolOutlined, GithubOutlined,
  MailOutlined, TrophyOutlined, CalendarOutlined, EditOutlined,
  SaveOutlined, CloseOutlined, PlusOutlined, DeleteOutlined
} from '@ant-design/icons'
import api from '../api'

const { Title, Paragraph, Text, Link: AntLink } = Typography

export default function Resume({ user }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const fetchResume = () => {
    setLoading(true)
    api.get('/resume/')
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchResume()
  }, [])

  const handleEdit = () => {
    form.setFieldsValue(data)
    setIsEditing(true)
  }

  const handleCancel = () => setIsEditing(false)

  const onFinish = async (values) => {
    setSubmitting(true)
    try {
      const res = await api.post('/resume/', values)
      setData(res.data)
      message.success('保存成功')
      setIsEditing(false)
    } catch {
      message.error('保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
  if (!data) return null

  if (isEditing) {
    return (
      <div style={{ maxWidth: 850, margin: '0 auto', padding: '40px 24px' }}>
        <Card title="编辑简历" bordered={false} className="glass-panel" extra={
          <Space>
            <Button onClick={handleCancel} icon={<CloseOutlined />}>取消</Button>
            <Button type="primary" onClick={() => form.submit()} loading={submitting} icon={<SaveOutlined />}>保存</Button>
          </Space>
        }>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Divider orientation="left">基本信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="姓名" rules={[{ required: true }]}><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="title" label="职位/头衔" rules={[{ required: true }]}><Input /></Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="bio" label="个人简介"><Input.TextArea rows={3} /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['contact', 'email']} label="邮箱"><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['contact', 'github']} label="GitHub 链接"><Input /></Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">教育经历</Divider>
            <Form.List name="education">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card size="small" key={key} style={{ marginBottom: 16 }} extra={<DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}>
                      <Row gutter={16}>
                        <Col span={8}><Form.Item {...restField} name={[name, 'school']} label="学校"><Input /></Form.Item></Col>
                        <Col span={8}><Form.Item {...restField} name={[name, 'major']} label="专业"><Input /></Form.Item></Col>
                        <Col span={8}><Form.Item {...restField} name={[name, 'degree']} label="学历"><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item {...restField} name={[name, 'start']} label="开始时间"><Input placeholder="如 2022-09" /></Form.Item></Col>
                        <Col span={12}><Form.Item {...restField} name={[name, 'end']} label="结束时间"><Input placeholder="如 2026-06" /></Form.Item></Col>
                        <Col span={24}><Form.Item {...restField} name={[name, 'description']} label="简述"><Input.TextArea rows={2} /></Form.Item></Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加教育经历</Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">工作/实践经历</Divider>
            <Form.List name="experience">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card size="small" key={key} style={{ marginBottom: 16 }} extra={<DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}>
                      <Row gutter={16}>
                        <Col span={12}><Form.Item {...restField} name={[name, 'company']} label="公司/项目名"><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item {...restField} name={[name, 'role']} label="担任角色"><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item {...restField} name={[name, 'start']} label="开始时间"><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item {...restField} name={[name, 'end']} label="结束时间"><Input /></Form.Item></Col>
                        <Col span={24}><Form.Item {...restField} name={[name, 'description']} label="详细描述"><Input.TextArea rows={3} /></Form.Item></Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加工作/实践经历</Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">项目经历</Divider>
            <Form.List name="projects">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card size="small" key={key} style={{ marginBottom: 16 }} extra={<DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}>
                      <Row gutter={16}>
                        <Col span={12}><Form.Item {...restField} name={[name, 'name']} label="项目名"><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item {...restField} name={[name, 'link']} label="项目链接"><Input /></Form.Item></Col>
                        <Col span={24}><Form.Item {...restField} name={[name, 'description']} label="项目描述"><Input.TextArea rows={2} /></Form.Item></Col>
                        <Col span={24}>
                          <Form.Item {...restField} name={[name, 'tech']} label="技术栈 (使用半角逗号分隔)" normalize={value => (typeof value === 'string' ? value.split(',').map(v => v.trim()) : value)}>
                            <Input placeholder="例如: React, Django, Python" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加项目</Button>
                </>
              )}
            </Form.List>

            <Divider orientation="left">技能</Divider>
            <Form.List name="skills">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                        <Input placeholder="技能名称 (如 React)" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'level']} rules={[{ required: true }]}>
                        <InputNumber min={0} max={100} placeholder="熟练度 %" />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginBottom: 24 }}>添加技能</Button>
                </>
              )}
            </Form.List>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting} block size="large">保存简历修改</Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 850, margin: '0 auto', padding: '40px 24px' }}>
      {user?.is_staff && (
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            编辑简历
          </Button>
        </div>
      )}
      
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
            items={data.education?.map((edu, idx) => ({
              key: idx,
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
                items={data.experience.map((exp, idx) => ({
                  key: idx,
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
