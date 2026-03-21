import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Upload, message, Table, Card, Row, Col, Modal, Typography, Space, Image } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import dayjs from 'dayjs';

const { Title } = Typography;

function normUploadFileList(e) {
  if (Array.isArray(e)) return e;
  return e?.fileList ?? [];
}

export default function WeightDiary({ user }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchRecords = async () => {
    try {
      const res = await api.get('/weight_loss/records/');
      const sorted = res.data.results ? res.data.results.sort((a, b) => new Date(a.date) - new Date(b.date)) : res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setRecords(sorted);
    } catch (error) {
      console.error('Error fetching records:', error);
      message.error('获取记录失败');
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const onFinish = async (values) => {
    if (!user) {
      message.error('请先登录');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('weight', values.weight);
    formData.append('date', values.date.format('YYYY-MM-DD'));
    if (values.activity) formData.append('activity', values.activity);

    const pictureList = Array.isArray(values.pictures) ? values.pictures : [];
    pictureList.forEach((file) => {
      if (file.originFileObj) {
        formData.append('pictures', file.originFileObj);
      }
    });

    try {
      await api.post('/weight_loss/records/', formData);
      message.success('记录添加成功！');
      form.resetFields();
      setIsModalOpen(false);
      fetchRecords();
    } catch (error) {
      console.error('Error adding record:', error);
      message.error('添加记录失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '活动记录',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: '体重 (kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
    },
    {
      title: '进度图片',
      key: 'images',
      width: 200,
      render: (_, record) => {
        if (!record.images || record.images.length === 0) return '无图片';
        return (
          <Image.PreviewGroup>
            <Space>
              {record.images.map((imgObj) => (
                <Image
                  key={imgObj.id}
                  src={imgObj.image}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
                  preview={{ src: imgObj.image }}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        );
      },
    },
  ];

  if (!user) {
    return <div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>请先登录以查看和添加您的减肥日记。</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>减肥日志</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ borderRadius: '8px' }}
          onClick={() => setIsModalOpen(true)}
        >
          添加活动
        </Button>
      </div>

      <Card title="体重变化趋势" bordered={false} style={{ marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={records} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#888' }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#888' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#1677ff"
                strokeWidth={3}
                activeDot={{ r: 8, strokeWidth: 0 }}
                name="体重 (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="历史记录" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table
          dataSource={records}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
      </Card>

      <Modal
        title="添加新的活动记录"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '24px' }}>
          <Form.Item
            name="activity"
            label="活动记录"
            rules={[{ required: true, message: '请简述您今天的活动！' }]}
          >
            <Input.TextArea rows={4} placeholder="例如：跑步机跑步2km，室内单车骑行10km..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="当前体重 (kg)"
                rules={[{ required: true, message: '请输入由您记录的体重！' }]}
              >
                <InputNumber min={0} max={500} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="日期"
                rules={[{ required: true, message: '请选择日期！' }]}
                initialValue={dayjs()}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="pictures"
            label="进度图片（可选，多张）"
            valuePropName="fileList"
            getValueFromEvent={normUploadFileList}
          >
            <Upload beforeUpload={() => false} multiple listType="picture" accept="image/*">
              <Button icon={<UploadOutlined />}>点击上传多张图片</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存记录
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
