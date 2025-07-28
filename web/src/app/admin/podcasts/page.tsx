'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Avatar,
  Popconfirm,
  message,
  Modal,
  Form,
  Select,
  Typography,
  Row,
  Col,
  Statistic,
  Image,
  Tooltip
} from 'antd'
import {
  SoundOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import AdminLayout from '@/components/AdminLayout'

const { Search } = Input
const { Title, Text } = Typography
const { Option } = Select

interface User {
  id: string
  name: string
  email: string
}

interface Podcast {
  id: string
  title: string
  description: string
  audioUrl: string
  coverUrl?: string
  status: 'PROCESSING' | 'PUBLISHED' | 'FAILED'
  views: number
  downloads: number
  duration?: number
  createdAt: string
  updatedAt: string
  user: User
}

interface PodcastsResponse {
  podcasts: Podcast[]
  total: number
  page: number
  pageSize: number
}

interface PodcastFormData {
  title: string
  description: string
  status: 'PROCESSING' | 'PUBLISHED' | 'FAILED'
}

export default function PodcastsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null)
  const [form] = Form.useForm()

  // 权限检查
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  // 获取播客列表
  const fetchPodcasts = useCallback(async (page = 1, search = '', status = 'all') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(search && { search }),
        ...(status !== 'all' && { status })
      })
      
      const response = await fetch(`/api/admin/podcasts?${params}`)
      if (!response.ok) {
        throw new Error('获取播客列表失败')
      }
      
      const data: PodcastsResponse = await response.json()
      setPodcasts(data.podcasts)
      setPagination(prev => ({
        ...prev,
        current: data.page,
        total: data.total
      }))
    } catch (error) {
      message.error('获取播客列表失败')
      console.error('Error fetching podcasts:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.pageSize])

  // 删除播客
  const handleDeletePodcast = async (podcastId: string) => {
    try {
      const response = await fetch(`/api/admin/podcasts/${podcastId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('删除播客失败')
      }
      
      message.success('播客删除成功')
      fetchPodcasts(pagination.current, searchText, statusFilter)
    } catch (error) {
      message.error('删除播客失败')
      console.error('Error deleting podcast:', error)
    }
  }

  // 搜索播客
  const handleSearch = (value: string) => {
    setSearchText(value)
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchPodcasts(1, value, statusFilter)
  }

  // 状态筛选
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchPodcasts(1, searchText, value)
  }

  // 表格分页变化
  const handleTableChange = (page: number, pageSize?: number) => {
    const newPagination = {
      ...pagination,
      current: page,
      ...(pageSize && { pageSize })
    }
    setPagination(newPagination)
    fetchPodcasts(page, searchText, statusFilter)
  }

  // 打开编辑模态框
  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast)
    form.setFieldsValue({
      title: podcast.title,
      description: podcast.description,
      status: podcast.status
    })
    setIsModalVisible(true)
  }

  // 保存播客
  const handleSave = async (values: PodcastFormData) => {
    if (!editingPodcast) return
    
    try {
      const response = await fetch(`/api/admin/podcasts/${editingPodcast.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      
      if (!response.ok) {
        throw new Error('更新播客失败')
      }
      
      message.success('播客更新成功')
      setIsModalVisible(false)
      fetchPodcasts(pagination.current, searchText, statusFilter)
    } catch (error) {
      message.error('更新播客失败')
      console.error('Error saving podcast:', error)
    }
  }

  // 格式化时长
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 初始化数据
  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      fetchPodcasts()
    }
  }, [session, fetchPodcasts])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const columns = [
    {
      title: '播客',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title: string, record: Podcast) => (
        <Space>
          {record.coverUrl ? (
            <Image
              src={record.coverUrl}
              alt={title}
              width={50}
              height={50}
              style={{ borderRadius: '4px' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          ) : (
            <Avatar icon={<SoundOutlined />} size={50} />
          )}
          <div>
            <div style={{ fontWeight: 500, marginBottom: '4px' }}>
              <Tooltip title={title}>
                <Text ellipsis style={{ maxWidth: '200px' }}>{title}</Text>
              </Tooltip>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              作者: {record.user.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              时长: {formatDuration(record.duration)}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          PUBLISHED: { color: 'green', text: '已发布' },
          PROCESSING: { color: 'orange', text: '处理中' },
          FAILED: { color: 'red', text: '失败' }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '统计',
      key: 'stats',
      width: 120,
      render: (_, record: Podcast) => (
        <div>
          <div style={{ fontSize: '12px', marginBottom: '2px' }}>
            <EyeOutlined style={{ marginRight: '4px' }} />
            {record.views} 观看
          </div>
          <div style={{ fontSize: '12px' }}>
            <DownloadOutlined style={{ marginRight: '4px' }} />
            {record.downloads} 下载
          </div>
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN')
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: Podcast) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个播客吗？"
            description="此操作不可恢复"
            onConfirm={() => handleDeletePodcast(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const totalViews = podcasts.reduce((sum, podcast) => sum + podcast.views, 0)
  const totalDownloads = podcasts.reduce((sum, podcast) => sum + podcast.downloads, 0)
  const publishedCount = podcasts.filter(p => p.status === 'PUBLISHED').length

  return (
    <AdminLayout>
      <div>
        <Title level={2} style={{ marginBottom: '24px' }}>播客管理</Title>
        
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总播客数"
                value={pagination.total}
                prefix={<SoundOutlined style={{ color: '#1890ff' }} />}
                suffix="个"
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已发布"
                value={publishedCount}
                prefix={<PlayCircleOutlined style={{ color: '#52c41a' }} />}
                suffix="个"
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总观看数"
                value={totalViews}
                prefix={<EyeOutlined style={{ color: '#faad14' }} />}
                suffix="次"
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="总下载数"
                value={totalDownloads}
                prefix={<DownloadOutlined style={{ color: '#f5222d' }} />}
                suffix="次"
              />
            </Card>
          </Col>
        </Row>

        {/* 播客列表 */}
        <Card>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <Space wrap>
              <Search
                placeholder="搜索播客标题或作者"
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                value={statusFilter}
                onChange={handleStatusFilter}
                style={{ width: 120 }}
              >
                <Option value="all">全部状态</Option>
                <Option value="PUBLISHED">已发布</Option>
                <Option value="PROCESSING">处理中</Option>
                <Option value="FAILED">失败</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchPodcasts(pagination.current, searchText, statusFilter)}
              >
                刷新
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={podcasts}
            rowKey="id"
            loading={loading}
            scroll={{ x: 800 }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              onChange: handleTableChange
            }}
          />
        </Card>

        {/* 编辑播客模态框 */}
        <Modal
          title="编辑播客"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入播客标题' }]}
            >
              <Input placeholder="请输入播客标题" />
            </Form.Item>
            
            <Form.Item
              label="描述"
              name="description"
              rules={[{ required: true, message: '请输入播客描述' }]}
            >
              <Input.TextArea 
                placeholder="请输入播客描述" 
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>
            
            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="PUBLISHED">已发布</Option>
                <Option value="PROCESSING">处理中</Option>
                <Option value="FAILED">失败</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  更新
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  )
}