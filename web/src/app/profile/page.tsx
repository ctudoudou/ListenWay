'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Space,
  Avatar,
  Divider,
  message,
  Row,
  Col,
  Statistic
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import Link from 'next/link'

const { Header, Content } = Layout
const { Title, Text } = Typography

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
  _count: {
    podcasts: number
  }
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // 检查登录状态
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  // 获取用户详细信息
  const fetchUserProfile = useCallback(async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`/api/user/profile`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
        form.setFieldsValue({
          name: data.name,
          email: data.email
        })
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }, [session?.user?.id, form])

  useEffect(() => {
    if (session) {
      fetchUserProfile()
    }
  }, [session, fetchUserProfile])

  // 更新用户信息
  const handleUpdateProfile = async (values: { name: string; email: string }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUserProfile(updatedUser)
        setEditing(false)
        message.success('个人信息更新成功')
        
        // 更新session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            email: updatedUser.email
          }
        })
      } else {
        const error = await response.json()
        message.error(error.error || '更新失败')
      }
    } catch (error) {
      message.error('网络错误')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>加载中...</div>
  }

  if (!session) {
    return null
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: '#667eea',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <Space>
          <Link href="/">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              style={{ color: 'white' }}
            >
              返回首页
            </Button>
          </Link>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            个人资料
          </Title>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#667eea', marginBottom: '16px' }}
                />
                <Title level={4}>{userProfile?.name || session.user?.name}</Title>
                <Text type="secondary">{userProfile?.email || session.user?.email}</Text>
                <Divider />
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MailOutlined style={{ color: '#667eea' }} />
                    <Text>{userProfile?.role === 'ADMIN' ? '管理员' : '普通用户'}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarOutlined style={{ color: '#667eea' }} />
                    <Text>
                      注册时间: {userProfile?.createdAt ? 
                        new Date(userProfile.createdAt).toLocaleDateString('zh-CN') : 
                        '未知'
                      }
                    </Text>
                  </div>
                </Space>
              </div>
            </Card>

            <Card style={{ marginTop: '16px' }} title="统计信息">
              <Row gutter={16}>
                <Col span={24}>
                  <Statistic
                    title="创建的播客"
                    value={userProfile?._count?.podcasts || 0}
                    suffix="个"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card 
              title="基本信息" 
              extra={
                <Button 
                  type={editing ? 'default' : 'primary'}
                  icon={editing ? <SaveOutlined /> : <EditOutlined />}
                  onClick={() => {
                    if (editing) {
                      form.submit()
                    } else {
                      setEditing(true)
                    }
                  }}
                  loading={loading}
                >
                  {editing ? '保存' : '编辑'}
                </Button>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                initialValues={{
                  name: userProfile?.name || session.user?.name,
                  email: userProfile?.email || session.user?.email
                }}
              >
                <Form.Item
                  label="用户名"
                  name="name"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 2, message: '用户名至少2个字符' }
                  ]}
                >
                  <Input 
                    placeholder="请输入用户名" 
                    disabled={!editing}
                    prefix={<UserOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  label="邮箱地址"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱地址' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input 
                    placeholder="请输入邮箱地址" 
                    disabled={!editing}
                    prefix={<MailOutlined />}
                  />
                </Form.Item>

                <Form.Item label="用户角色">
                  <Input 
                    value={userProfile?.role === 'ADMIN' ? '管理员' : '普通用户'}
                    disabled
                  />
                </Form.Item>

                <Form.Item label="用户ID">
                  <Input 
                    value={userProfile?.id || session.user?.id}
                    disabled
                  />
                </Form.Item>

                {editing && (
                  <Form.Item>
                    <Space>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        icon={<SaveOutlined />}
                      >
                        保存更改
                      </Button>
                      <Button 
                        onClick={() => {
                          setEditing(false)
                          form.resetFields()
                        }}
                      >
                        取消
                      </Button>
                    </Space>
                  </Form.Item>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}