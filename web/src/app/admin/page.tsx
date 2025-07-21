'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Layout,
  Table,
  Card,
  Typography,
  Input,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Avatar,
  Statistic,
  Row,
  Col
} from 'antd'
import {
  UserOutlined,
  SearchOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DashboardOutlined
} from '@ant-design/icons'
import { signOut } from 'next-auth/react'

const { Header, Content } = Layout
const { Title } = Typography
const { Search } = Input

interface User {
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

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // 检查权限
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  // 获取用户列表
  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data: UsersResponse = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setPagination(prev => ({
          ...prev,
          current: data.pagination.page,
          total: data.pagination.total
        }))
      } else {
        message.error('获取用户列表失败')
      }
    } catch (error) {
      message.error('网络错误')
    } finally {
      setLoading(false)
    }
  }

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        message.success('用户删除成功')
        fetchUsers(pagination.current, searchText)
      } else {
        const data = await response.json()
        message.error(data.error || '删除失败')
      }
    } catch (error) {
      message.error('网络错误')
    }
  }

  // 搜索用户
  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchUsers(1, value)
  }

  // 页面变化
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination(prev => ({ ...prev, current: page, pageSize }))
    fetchUsers(page, searchText)
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsers()
    }
  }, [session])

  if (status === 'loading') {
    return <div>加载中...</div>
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const columns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? '管理员' : '用户'}
        </Tag>
      )
    },
    {
      title: '播客数量',
      dataIndex: '_count',
      key: 'podcasts',
      render: (count: { podcasts: number }) => count.podcasts
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN')
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: User) => (
        <Space>
          {record.id !== session.user.id && (
            <Popconfirm
              title="确定要删除这个用户吗？"
              description="此操作不可恢复"
              onConfirm={() => handleDeleteUser(record.id)}
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
          )}
        </Space>
      )
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        background: '#667eea',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DashboardOutlined style={{ color: 'white', fontSize: '20px', marginRight: '12px' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            管理后台
          </Title>
        </div>
        <Space>
          <span style={{ color: 'white' }}>欢迎，{session.user.name}</span>
          <Button type="primary" ghost onClick={() => signOut()}>
            退出登录
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="总用户数"
                value={pagination.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="管理员数量"
                value={users.filter(u => u.role === 'ADMIN').length}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="普通用户数量"
                value={users.filter(u => u.role === 'USER').length}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4}>用户管理</Title>
            <Space>
              <Search
                placeholder="搜索用户名或邮箱"
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchUsers(pagination.current, searchText)}
              >
                刷新
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
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
      </Content>
    </Layout>
  )
}