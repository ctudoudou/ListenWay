'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Card,
  Typography,
  Statistic,
  Row,
  Col,
  List,
  Avatar,
  Progress,
  Tag
} from 'antd'
import {
  UserOutlined,
  SoundOutlined,
  EyeOutlined,
  DownloadOutlined,
  TrophyOutlined,
  RiseOutlined,
  SettingOutlined
} from '@ant-design/icons'
import AdminLayout from '@/components/AdminLayout'

const { Title, Text } = Typography

interface DashboardStats {
  totalUsers: number
  totalPodcasts: number
  totalViews: number
  totalDownloads: number
  recentUsers: User[]
  recentPodcasts: Podcast[]
  systemHealth: {
    cpu: number
    memory: number
    storage: number
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

interface Podcast {
  id: string
  title: string
  status: string
  createdAt: string
  user: {
    name: string
  }
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // 获取仪表板数据
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchDashboardStats()
    }
  }, [session])

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  // 模拟数据（当API未准备好时）
  const mockStats: DashboardStats = {
    totalUsers: 1250,
    totalPodcasts: 89,
    totalViews: 15420,
    totalDownloads: 8930,
    recentUsers: [
      { id: '1', name: '张三', email: 'zhang@example.com', role: 'USER', createdAt: '2024-01-20' },
      { id: '2', name: '李四', email: 'li@example.com', role: 'USER', createdAt: '2024-01-19' },
      { id: '3', name: '王五', email: 'wang@example.com', role: 'USER', createdAt: '2024-01-18' },
    ],
    recentPodcasts: [
      { id: '1', title: '科技前沿讨论', status: 'PUBLISHED', createdAt: '2024-01-20', user: { name: '张三' } },
      { id: '2', title: '生活随想录', status: 'PROCESSING', createdAt: '2024-01-19', user: { name: '李四' } },
      { id: '3', title: '音乐分享会', status: 'PUBLISHED', createdAt: '2024-01-18', user: { name: '王五' } },
    ],
    systemHealth: {
      cpu: 45,
      memory: 68,
      storage: 32
    }
  }

  const currentStats = stats || mockStats

  return (
    <AdminLayout>
      <div>
        <Title level={2} style={{ marginBottom: '24px' }}>仪表板概览</Title>
        
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总用户数"
                value={currentStats.totalUsers}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总播客数"
                value={currentStats.totalPodcasts}
                prefix={<SoundOutlined style={{ color: '#52c41a' }} />}
                suffix="个"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总观看数"
                value={currentStats.totalViews}
                prefix={<EyeOutlined style={{ color: '#faad14' }} />}
                suffix="次"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总下载数"
                value={currentStats.totalDownloads}
                prefix={<DownloadOutlined style={{ color: '#f5222d' }} />}
                suffix="次"
              />
            </Card>
          </Col>
        </Row>

        {/* 系统健康状态 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={8}>
            <Card title="系统健康状态" extra={<TrophyOutlined />}>
              <div style={{ marginBottom: '16px' }}>
                <Text>CPU 使用率</Text>
                <Progress 
                  percent={currentStats.systemHealth.cpu} 
                  status={currentStats.systemHealth.cpu > 80 ? 'exception' : 'active'}
                  strokeColor={currentStats.systemHealth.cpu > 80 ? '#ff4d4f' : '#52c41a'}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Text>内存使用率</Text>
                <Progress 
                  percent={currentStats.systemHealth.memory} 
                  status={currentStats.systemHealth.memory > 80 ? 'exception' : 'active'}
                  strokeColor={currentStats.systemHealth.memory > 80 ? '#ff4d4f' : '#1890ff'}
                />
              </div>
              <div>
                <Text>存储使用率</Text>
                <Progress 
                  percent={currentStats.systemHealth.storage} 
                  status={currentStats.systemHealth.storage > 80 ? 'exception' : 'active'}
                  strokeColor={currentStats.systemHealth.storage > 80 ? '#ff4d4f' : '#faad14'}
                />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="最新用户" extra={<RiseOutlined />}>
              <List
                dataSource={currentStats.recentUsers}
                renderItem={(user) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={user.name}
                      description={
                        <div>
                          <div>{user.email}</div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                          </Text>
                        </div>
                      }
                    />
                    <Tag color={user.role === 'ADMIN' ? 'red' : 'blue'}>
                      {user.role === 'ADMIN' ? '管理员' : '用户'}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="最新播客" extra={<SoundOutlined />}>
              <List
                dataSource={currentStats.recentPodcasts}
                renderItem={(podcast) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<SoundOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                      title={podcast.title}
                      description={
                        <div>
                          <div>作者: {podcast.user.name}</div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(podcast.createdAt).toLocaleDateString('zh-CN')}
                          </Text>
                        </div>
                      }
                    />
                    <Tag color={podcast.status === 'PUBLISHED' ? 'green' : 'orange'}>
                      {podcast.status === 'PUBLISHED' ? '已发布' : '处理中'}
                    </Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* 快速操作 */}
        <Card title="快速操作">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <div>用户管理</div>
              </Card.Grid>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                <SoundOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <div>播客管理</div>
              </Card.Grid>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                <RiseOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '8px' }} />
                <div>数据分析</div>
              </Card.Grid>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card.Grid style={{ width: '100%', textAlign: 'center' }}>
                <SettingOutlined style={{ fontSize: '24px', color: '#f5222d', marginBottom: '8px' }} />
                <div>系统设置</div>
              </Card.Grid>
            </Col>
          </Row>
        </Card>
      </div>
    </AdminLayout>
  )
}