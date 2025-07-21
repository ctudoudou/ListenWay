'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text } = Typography

interface SignInForm {
  email: string
  password: string
}

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [form] = Form.useForm()

  const onFinish = async (values: SignInForm) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      })

      if (result?.error) {
        message.error('登录失败，请检查邮箱和密码')
      } else {
        message.success('登录成功')
        const session = await getSession()
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      message.error('登录过程中发生错误')
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
            用户登录
          </Title>
          <Text type="secondary">
            登录到 ListenWay 播客生成器
          </Text>
        </div>

        <Form
          form={form}
          name="signin"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
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
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Text type="secondary">还没有账户？</Text>
              <Link href="/auth/signup" style={{ color: '#667eea' }}>
                立即注册
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}