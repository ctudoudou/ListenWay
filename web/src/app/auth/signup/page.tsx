'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text } = Typography

interface SignUpForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [form] = Form.useForm()

  const onFinish = async (values: SignUpForm) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        message.success('注册成功，请登录')
        router.push('/auth/signin')
      } else {
        message.error(data.error || '注册失败')
      }
    } catch (error) {
      message.error('注册过程中发生错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <Card
        style={{
          width: 400,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#667eea', marginBottom: 8 }}>
            用户注册
          </Title>
          <Text type="secondary">
            创建您的 ListenWay 账户
          </Text>
        </div>

        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '请输入姓名' },
              { min: 2, message: '姓名至少2个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入姓名"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: '4px',
                background: '#667eea',
                border: 'none',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Text type="secondary">已有账户？</Text>
              <Link href="/auth/signin" style={{ color: '#667eea' }}>
                立即登录
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}