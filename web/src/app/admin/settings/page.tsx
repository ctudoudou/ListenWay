'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Space,
  InputNumber,
  Upload,
  Avatar
} from 'antd'
import {
  SettingOutlined,
  SaveOutlined,
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import AdminLayout from '@/components/AdminLayout'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

interface SystemSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  siteLogo?: string
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxFileSize: number
  allowedFileTypes: string[]
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  smtpSecure: boolean
  storageProvider: 'local' | 's3' | 'cloudinary'
  s3Bucket?: string
  s3Region?: string
  s3AccessKey?: string
  s3SecretKey?: string
  cloudinaryCloudName?: string
  cloudinaryApiKey?: string
  cloudinaryApiSecret?: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [settings, setSettings] = useState<SystemSettings | null>(null)

  // 权限检查
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  // 获取系统设置
  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      if (!response.ok) {
        throw new Error('获取系统设置失败')
      }
      
      const data = await response.json()
      setSettings(data)
      form.setFieldsValue(data)
    } catch (error) {
      message.error('获取系统设置失败')
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  // 保存系统设置
  const handleSave = async (values: SystemSettings) => {
    setSaveLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      
      if (!response.ok) {
        throw new Error('保存系统设置失败')
      }
      
      message.success('系统设置保存成功')
      setSettings(values)
    } catch (error) {
      message.error('保存系统设置失败')
      console.error('Error saving settings:', error)
    } finally {
      setSaveLoading(false)
    }
  }

  // 重置设置
  const handleReset = () => {
    if (settings) {
      form.setFieldsValue(settings)
      message.info('已重置为上次保存的设置')
    }
  }

  // 初始化数据
  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      fetchSettings()
    }
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <AdminLayout>
      <div>
        <Title level={2} style={{ marginBottom: '24px' }}>系统设置</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          loading={loading}
        >
          {/* 基本设置 */}
          <Card title="基本设置" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="网站名称"
                  name="siteName"
                  rules={[{ required: true, message: '请输入网站名称' }]}
                >
                  <Input placeholder="请输入网站名称" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="网站URL"
                  name="siteUrl"
                  rules={[
                    { required: true, message: '请输入网站URL' },
                    { type: 'url', message: '请输入有效的URL' }
                  ]}
                >
                  <Input placeholder="https://example.com" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="网站描述"
                  name="siteDescription"
                  rules={[{ required: true, message: '请输入网站描述' }]}
                >
                  <TextArea 
                    placeholder="请输入网站描述" 
                    rows={3}
                    maxLength={200}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 用户设置 */}
          <Card title="用户设置" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="允许用户注册"
                  name="allowRegistration"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="需要邮箱验证"
                  name="requireEmailVerification"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 文件上传设置 */}
          <Card title="文件上传设置" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="最大文件大小 (MB)"
                  name="maxFileSize"
                  rules={[{ required: true, message: '请输入最大文件大小' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={1000} 
                    placeholder="100"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="允许的文件类型"
                  name="allowedFileTypes"
                  rules={[{ required: true, message: '请选择允许的文件类型' }]}
                >
                  <Select 
                    mode="multiple" 
                    placeholder="选择允许的文件类型"
                    options={[
                      { label: 'MP3', value: 'mp3' },
                      { label: 'WAV', value: 'wav' },
                      { label: 'M4A', value: 'm4a' },
                      { label: 'FLAC', value: 'flac' },
                      { label: 'AAC', value: 'aac' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 存储设置 */}
          <Card title="存储设置" style={{ marginBottom: '24px' }}>
            <Form.Item
              label="存储提供商"
              name="storageProvider"
              rules={[{ required: true, message: '请选择存储提供商' }]}
            >
              <Select placeholder="选择存储提供商">
                <Option value="local">本地存储</Option>
                <Option value="s3">Amazon S3</Option>
                <Option value="cloudinary">Cloudinary</Option>
              </Select>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
              prevValues.storageProvider !== currentValues.storageProvider
            }>
              {({ getFieldValue }) => {
                const storageProvider = getFieldValue('storageProvider')
                
                if (storageProvider === 's3') {
                  return (
                    <>
                      <Divider>Amazon S3 配置</Divider>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="S3 Bucket"
                            name="s3Bucket"
                            rules={[{ required: true, message: '请输入S3 Bucket名称' }]}
                          >
                            <Input placeholder="your-bucket-name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="S3 Region"
                            name="s3Region"
                            rules={[{ required: true, message: '请输入S3 Region' }]}
                          >
                            <Input placeholder="us-east-1" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Access Key"
                            name="s3AccessKey"
                            rules={[{ required: true, message: '请输入Access Key' }]}
                          >
                            <Input placeholder="AKIA..." />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Secret Key"
                            name="s3SecretKey"
                            rules={[{ required: true, message: '请输入Secret Key' }]}
                          >
                            <Input.Password placeholder="请输入Secret Key" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )
                }
                
                if (storageProvider === 'cloudinary') {
                  return (
                    <>
                      <Divider>Cloudinary 配置</Divider>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Cloud Name"
                            name="cloudinaryCloudName"
                            rules={[{ required: true, message: '请输入Cloud Name' }]}
                          >
                            <Input placeholder="your-cloud-name" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label="API Key"
                            name="cloudinaryApiKey"
                            rules={[{ required: true, message: '请输入API Key' }]}
                          >
                            <Input placeholder="123456789012345" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label="API Secret"
                            name="cloudinaryApiSecret"
                            rules={[{ required: true, message: '请输入API Secret' }]}
                          >
                            <Input.Password placeholder="请输入API Secret" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )
                }
                
                return null
              }}
            </Form.Item>
          </Card>

          {/* 邮件设置 */}
          <Card title="邮件设置" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP 主机"
                  name="smtpHost"
                  rules={[{ required: true, message: '请输入SMTP主机' }]}
                >
                  <Input placeholder="smtp.gmail.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP 端口"
                  name="smtpPort"
                  rules={[{ required: true, message: '请输入SMTP端口' }]}
                >
                  <InputNumber 
                    min={1} 
                    max={65535} 
                    placeholder="587"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP 用户名"
                  name="smtpUser"
                  rules={[{ required: true, message: '请输入SMTP用户名' }]}
                >
                  <Input placeholder="your-email@gmail.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="SMTP 密码"
                  name="smtpPassword"
                  rules={[{ required: true, message: '请输入SMTP密码' }]}
                >
                  <Input.Password placeholder="请输入SMTP密码" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="启用SSL/TLS"
                  name="smtpSecure"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 操作按钮 */}
          <Card>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={saveLoading}
              >
                保存设置
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Card>
        </Form>
      </div>
    </AdminLayout>
  )
}