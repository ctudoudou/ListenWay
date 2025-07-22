'use client'

import { useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Layout,
  Menu,
  Typography,
  Button,
  Space,
  Avatar,
  Dropdown,
  MenuProps
} from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  SoundOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const { Header, Sider, Content } = Layout
const { Title } = Typography

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // 检查权限
  if (!session || session.user.role !== 'ADMIN') {
    router.push('/auth/signin')
    return null
  }

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">仪表板</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link href="/admin/users">用户管理</Link>,
    },
    {
      key: '/admin/podcasts',
      icon: <SoundOutlined />,
      label: <Link href="/admin/podcasts">播客管理</Link>,
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: <Link href="/admin/analytics">数据分析</Link>,
    },
    {
      key: '/admin/content',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/content">内容管理</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">系统设置</Link>,
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          个人资料
        </Link>
      ),
    },
    {
      key: 'home',
      icon: <DashboardOutlined />,
      label: (
        <Link href="/" style={{ textDecoration: 'none' }}>
          返回首页
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => signOut(),
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#001529',
        }}
      >
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#002140',
          margin: '16px',
          borderRadius: '6px'
        }}>
          <Title 
            level={4} 
            style={{ 
              color: 'white', 
              margin: 0,
              fontSize: collapsed ? '16px' : '18px'
            }}
          >
            {collapsed ? 'LW' : 'ListenWay'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Sider>
      
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Title level={4} style={{ margin: 0, color: '#001529' }}>
              管理后台
            </Title>
          </Space>
          
          <Space>
            <span style={{ color: '#666' }}>欢迎，{session.user?.name}</span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar 
                style={{ cursor: 'pointer', backgroundColor: '#667eea' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '6px',
          minHeight: 'calc(100vh - 112px)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}