'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Space,
  Table,
  Tag,
  Progress,
  List,
  Avatar
} from 'antd'
import {
  UserOutlined,
  SoundOutlined,
  EyeOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import AdminLayout from '@/components/AdminLayout'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalPodcasts: number
    totalViews: number
    totalDownloads: number
    userGrowth: number
    podcastGrowth: number
    viewGrowth: number
    downloadGrowth: number
  }
  userStats: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
    newUsersToday: number
    userRetentionRate: number
  }
  contentStats: {
    publishedToday: number
    averageDuration: number
    topCategories: Array<{
      category: string
      count: number
      percentage: number
    }>
  }
  topPodcasts: Array<{
    id: string
    title: string
    user: {
      name: string
    }
    views: number
    downloads: number
    createdAt: string
  }>
  topUsers: Array<{
    id: string
    name: string
    email: string
    podcastCount: number
    totalViews: number
    totalDownloads: number
  }>
  recentActivity: Array<{
    id: string
    type: 'user_register' | 'podcast_upload' | 'podcast_view' | 'podcast_download'
    user: {
      name: string
    }
    podcast?: {
      title: string
    }
    createdAt: string
  }>
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ])
  const [timeRange, setTimeRange] = useState('30d')

  // 权限检查
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  // 获取分析数据
  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        timeRange
      })
      
      const response = await fetch(`/api/admin/analytics?${params}`)
      if (!response.ok) {
        throw new Error('获取分析数据失败')
      }
      
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // 使用模拟数据
      setAnalytics({
        overview: {
          totalUsers: 1250,
          totalPodcasts: 340,
          totalViews: 15680,
          totalDownloads: 8920,
          userGrowth: 12.5,
          podcastGrowth: 8.3,
          viewGrowth: 23.1,
          downloadGrowth: 15.7
        },
        userStats: {
          dailyActiveUsers: 156,
          weeklyActiveUsers: 892,
          monthlyActiveUsers: 1180,
          newUsersToday: 23,
          userRetentionRate: 68.5
        },
        contentStats: {
          publishedToday: 12,
          averageDuration: 1847, // 秒
          topCategories: [
            { category: '科技', count: 89, percentage: 26.2 },
            { category: '教育', count: 76, percentage: 22.4 },
            { category: '娱乐', count: 65, percentage: 19.1 },
            { category: '新闻', count: 54, percentage: 15.9 },
            { category: '其他', count: 56, percentage: 16.4 }
          ]
        },
        topPodcasts: [
          {
            id: '1',
            title: '深度学习入门指南',
            user: { name: '张三' },
            views: 2340,
            downloads: 1560,
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            title: 'React 最佳实践',
            user: { name: '李四' },
            views: 1890,
            downloads: 1230,
            createdAt: '2024-01-12'
          },
          {
            id: '3',
            title: 'Python 数据分析',
            user: { name: '王五' },
            views: 1650,
            downloads: 980,
            createdAt: '2024-01-10'
          }
        ],
        topUsers: [
          {
            id: '1',
            name: '张三',
            email: 'zhangsan@example.com',
            podcastCount: 15,
            totalViews: 8920,
            totalDownloads: 5640
          },
          {
            id: '2',
            name: '李四',
            email: 'lisi@example.com',
            podcastCount: 12,
            totalViews: 6780,
            totalDownloads: 4320
          },
          {
            id: '3',
            name: '王五',
            email: 'wangwu@example.com',
            podcastCount: 10,
            totalViews: 5430,
            totalDownloads: 3210
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'podcast_upload',
            user: { name: '张三' },
            podcast: { title: '新的播客内容' },
            createdAt: '2024-01-21T10:30:00Z'
          },
          {
            id: '2',
            type: 'user_register',
            user: { name: '新用户' },
            createdAt: '2024-01-21T09:15:00Z'
          },
          {
            id: '3',
            type: 'podcast_view',
            user: { name: '李四' },
            podcast: { title: 'React 教程' },
            createdAt: '2024-01-21T08:45:00Z'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  // 时间范围变化
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
    const now = dayjs()
    let start: dayjs.Dayjs
    
    switch (value) {
      case '7d':
        start = now.subtract(7, 'day')
        break
      case '30d':
        start = now.subtract(30, 'day')
        break
      case '90d':
        start = now.subtract(90, 'day')
        break
      case '1y':
        start = now.subtract(1, 'year')
        break
      default:
        start = now.subtract(30, 'day')
    }
    
    setDateRange([start, now])
  }

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 获取增长趋势图标
  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <RiseOutlined style={{ color: '#52c41a' }} />
    ) : (
      <FallOutlined style={{ color: '#f5222d' }} />
    )
  }

  // 获取活动类型标签
  const getActivityTag = (type: string) => {
    const typeConfig = {
      user_register: { color: 'blue', text: '用户注册' },
      podcast_upload: { color: 'green', text: '上传播客' },
      podcast_view: { color: 'orange', text: '观看播客' },
      podcast_download: { color: 'purple', text: '下载播客' }
    }
    const config = typeConfig[type as keyof typeof typeConfig]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  // 初始化数据
  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      fetchAnalytics()
    }
  }, [session, dateRange, timeRange])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  if (!analytics) {
    return <div>Loading analytics...</div>
  }

  const topPodcastColumns = [
    {
      title: '播客',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{title}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            作者: {record.user.name}
          </Text>
        </div>
      )
    },
    {
      title: '观看数',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => views.toLocaleString()
    },
    {
      title: '下载数',
      dataIndex: 'downloads',
      key: 'downloads',
      render: (downloads: number) => downloads.toLocaleString()
    }
  ]

  const topUserColumns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: '播客数',
      dataIndex: 'podcastCount',
      key: 'podcastCount'
    },
    {
      title: '总观看数',
      dataIndex: 'totalViews',
      key: 'totalViews',
      render: (views: number) => views.toLocaleString()
    },
    {
      title: '总下载数',
      dataIndex: 'totalDownloads',
      key: 'totalDownloads',
      render: (downloads: number) => downloads.toLocaleString()
    }
  ]

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2}>数据分析</Title>
          <Space>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              style={{ width: 120 }}
            >
              <Option value="7d">最近7天</Option>
              <Option value="30d">最近30天</Option>
              <Option value="90d">最近90天</Option>
              <Option value="1y">最近1年</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates)}
              format="YYYY-MM-DD"
            />
          </Space>
        </div>
        
        {/* 概览统计 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总用户数"
                value={analytics.overview.totalUsers}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                suffix={
                  <Space>
                    <span>人</span>
                    {getGrowthIcon(analytics.overview.userGrowth)}
                    <Text type={analytics.overview.userGrowth >= 0 ? 'success' : 'danger'}>
                      {Math.abs(analytics.overview.userGrowth)}%
                    </Text>
                  </Space>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总播客数"
                value={analytics.overview.totalPodcasts}
                prefix={<SoundOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <Space>
                    <span>个</span>
                    {getGrowthIcon(analytics.overview.podcastGrowth)}
                    <Text type={analytics.overview.podcastGrowth >= 0 ? 'success' : 'danger'}>
                      {Math.abs(analytics.overview.podcastGrowth)}%
                    </Text>
                  </Space>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总观看数"
                value={analytics.overview.totalViews}
                prefix={<EyeOutlined style={{ color: '#faad14' }} />}
                suffix={
                  <Space>
                    <span>次</span>
                    {getGrowthIcon(analytics.overview.viewGrowth)}
                    <Text type={analytics.overview.viewGrowth >= 0 ? 'success' : 'danger'}>
                      {Math.abs(analytics.overview.viewGrowth)}%
                    </Text>
                  </Space>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总下载数"
                value={analytics.overview.totalDownloads}
                prefix={<DownloadOutlined style={{ color: '#f5222d' }} />}
                suffix={
                  <Space>
                    <span>次</span>
                    {getGrowthIcon(analytics.overview.downloadGrowth)}
                    <Text type={analytics.overview.downloadGrowth >= 0 ? 'success' : 'danger'}>
                      {Math.abs(analytics.overview.downloadGrowth)}%
                    </Text>
                  </Space>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* 用户活跃度和内容统计 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={12}>
            <Card title="用户活跃度" extra={<UserOutlined />}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="日活跃用户"
                    value={analytics.userStats.dailyActiveUsers}
                    suffix="人"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="周活跃用户"
                    value={analytics.userStats.weeklyActiveUsers}
                    suffix="人"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="月活跃用户"
                    value={analytics.userStats.monthlyActiveUsers}
                    suffix="人"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="今日新增"
                    value={analytics.userStats.newUsersToday}
                    suffix="人"
                  />
                </Col>
                <Col span={24}>
                  <div style={{ marginTop: '16px' }}>
                    <Text>用户留存率</Text>
                    <Progress 
                      percent={analytics.userStats.userRetentionRate} 
                      strokeColor="#52c41a"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="内容统计" extra={<SoundOutlined />}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="今日发布"
                    value={analytics.contentStats.publishedToday}
                    suffix="个"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="平均时长"
                    value={formatDuration(analytics.contentStats.averageDuration)}
                  />
                </Col>
                <Col span={24}>
                  <div style={{ marginTop: '16px' }}>
                    <Text strong>热门分类</Text>
                    {analytics.contentStats.topCategories.map((category, index) => (
                      <div key={index} style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Text>{category.category}</Text>
                          <Text>{category.count}个 ({category.percentage}%)</Text>
                        </div>
                        <Progress 
                          percent={category.percentage} 
                          showInfo={false}
                          strokeColor={['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'][index]}
                        />
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* 排行榜和活动 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="热门播客" extra={<TrophyOutlined />}>
              <Table
                columns={topPodcastColumns}
                dataSource={analytics.topPodcasts}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="活跃用户" extra={<RiseOutlined />}>
              <Table
                columns={topUserColumns}
                dataSource={analytics.topUsers}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* 最近活动 */}
        <Card title="最近活动" style={{ marginTop: '16px' }}>
          <List
            dataSource={analytics.recentActivity}
            renderItem={(activity) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      {getActivityTag(activity.type)}
                      <Text>{activity.user.name}</Text>
                      {activity.podcast && (
                        <Text type="secondary">- {activity.podcast.title}</Text>
                      )}
                    </Space>
                  }
                  description={
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {dayjs(activity.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </AdminLayout>
  )
}