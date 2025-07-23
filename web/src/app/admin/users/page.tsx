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
  Statistic
} from 'antd'
import {
  UserOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons'
import AdminLayout from '@/components/AdminLayout'

const { Search } = Input
const { Title } = Typography
const { Option } = Select

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  _count: {
    podcasts: number
  }
}

interface UsersResponse {
  users: User[]
  total: number
  page: number
  pageSize: number
}

interface UserFormData {
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  password?: string
}

export default function UsersPage() {
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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  // 权限检查
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  // 获取用户列表
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(search && { search })
      })
      
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) {
        throw new Error('获取用户列表失败')
      }
      
      const data: UsersResponse = await response.json()
      setUsers(data.users)
      setPagination(prev => ({
        ...prev,
        current: data.page,
        total: data.total
      }))
    } catch (error) {
      message.error('获取用户列表失败')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.pageSize])

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('删除用户失败')
      }
      
      message.success('用户删除成功')
      fetchUsers(pagination.current, searchText)
    } catch (error) {
      message.error('删除用户失败')
      console.error('Error deleting user:', error)
    }
  }

  // 搜索用户
  const handleSearch = (value: string) => {
    setSearchText(value)
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchUsers(1, value)
  }

  // 表格分页变化
  const handleTableChange = (page: number, pageSize?: number) => {
    const newPagination = {
      ...pagination,
      current: page,
      ...(pageSize && { pageSize })
    }
    setPagination(newPagination)
    fetchUsers(page, searchText)
  }

  // 打开编辑/新增模态框
  const handleEdit = (user?: User) => {
    setEditingUser(user || null)
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role
      })
    } else {
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  // 保存用户
  const handleSave = async (values: UserFormData) => {
    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      
      if (!response.ok) {
        throw new Error(editingUser ? '更新用户失败' : '创建用户失败')
      }
      
      message.success(editingUser ? '用户更新成功' : '用户创建成功')
      setIsModalVisible(false)
      fetchUsers(pagination.current, searchText)
    } catch (error) {
      message.error(editingUser ? '更新用户失败' : '创建用户失败')
      console.error('Error saving user:', error)
    }
  }

  // 初始化数据
  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      fetchUsers()
    }
  }, [session, fetchUsers])

  if (status === 'loading') {
    return <div>Loading...</div>
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
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
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
    <AdminLayout>
      <div>
        <Title level={2} style={{ marginBottom: '24px' }}>用户管理</Title>
        
        {/* 统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="总用户数"
                value={pagination.total}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="管理员数量"
                value={users.filter(u => u.role === 'ADMIN').length}
                prefix={<UserOutlined style={{ color: '#f5222d' }} />}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="普通用户数量"
                value={users.filter(u => u.role === 'USER').length}
                prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                suffix="人"
              />
            </Card>
          </Col>
        </Row>

        {/* 用户列表 */}
        <Card>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Search
                placeholder="搜索用户名或邮箱"
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchUsers(pagination.current, searchText)}
              >
                刷新
              </Button>
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleEdit()}
            >
              新增用户
            </Button>
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

        {/* 编辑/新增用户模态框 */}
        <Modal
          title={editingUser ? '编辑用户' : '新增用户'}
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
              label="用户名"
              name="name"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            
            <Form.Item
              label="角色"
              name="role"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="USER">普通用户</Option>
                <Option value="ADMIN">管理员</Option>
              </Select>
            </Form.Item>
            
            {!editingUser && (
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
            )}
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingUser ? '更新' : '创建'}
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