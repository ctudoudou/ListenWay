'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession, signIn, signOut } from 'next-auth/react';
import { 
  Layout, 
  Input, 
  Button, 
  Select, 
  Card, 
  Typography, 
  Space, 
  Avatar, 
  List, 
  Row, 
  Col,
  Radio,
  Dropdown,
  MenuProps} from 'antd';
import {
  SearchOutlined,
  SoundOutlined,
  FileTextOutlined,
  EditOutlined,
  LinkOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import '../i18n';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function Home() {
  const { t, i18n } = useTranslation();
  const { data: session, status } = useSession();
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('繁體中文');
  const [host, setHost] = useState('某人');
  const [guest, setGuest] = useState('某人');

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    ...(session?.user?.role === 'ADMIN' ? [{
      key: 'admin',
      icon: <SettingOutlined />,
      label: (
        <Link href="/admin" style={{ textDecoration: 'none' }}>
          管理后台
        </Link>
      ),
    }] : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => signOut(),
    },
  ];

  const audioList = [
    { title: '【聲明】example1...', duration: '05:19', date: '16/07/2025' },
    { title: '【聲明】example2...', duration: '04:36', date: '16/07/2025' },
    { title: '【聲明】example3...', duration: '06:22', date: '16/07/2025' },
    { title: '【聲明】example4...', duration: '05:02', date: '16/07/2025' }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#667eea', 
        borderBottom: '1px solid #e2e8f0',
        padding: '0 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title level={2} style={{ 
          margin: 0, 
          color: '#fff',
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          {t('title')}
        </Title>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {status === 'loading' ? (
            <Button loading type="primary" ghost>
              加载中...
            </Button>
          ) : session ? (
            <Space>
              <span style={{ color: 'white' }}>欢迎，{session.user?.name}</span>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar 
                  style={{ cursor: 'pointer', backgroundColor: '#764ba2' }}
                  icon={<UserOutlined />}
                />
              </Dropdown>
            </Space>
          ) : (
            <Space>
              <Button type="primary" ghost onClick={() => signIn()}>
                登录
              </Button>
              <Link href="/auth/signup">
                <Button type="primary">
                  注册
                </Button>
              </Link>
            </Space>
          )}
        </div>
      </Header>

      <Layout>
         <Sider width={300} style={{ 
           background: '#f8fafc', 
           borderRight: '1px solid #e2e8f0'
         }}>
           <div style={{ padding: '20px' }}>
             <Input
               placeholder={t('search')}
               prefix={<SearchOutlined />}
               style={{ 
                 marginBottom: '24px',
                 borderRadius: '4px',
                 border: '1px solid #d1d5db'
               }}
               size="large"
             />
             
             <div style={{ marginBottom: '24px' }}>
               <Title level={5} style={{ 
                 marginBottom: '16px',
                 color: '#374151',
                 fontWeight: 600
               }}>{t('audioList.title')}</Title>
               <List
                 dataSource={audioList}
                 renderItem={(item) => (
                   <List.Item style={{ padding: '8px 0', cursor: 'pointer' }}>
                     <List.Item.Meta
                       avatar={
                         <Avatar 
                           style={{ backgroundColor: '#722ed1' }} 
                           icon={<SoundOutlined />}
                         />
                       }
                       title={
                         <Text style={{ fontSize: '14px' }}>{item.title}</Text>
                       }
                       description={
                         <Text type="secondary" style={{ fontSize: '12px' }}>
                           {item.duration} • {item.date}
                         </Text>
                       }
                     />
                   </List.Item>
                 )}
               />
             </div>
           </div>

         </Sider>

        <Content style={{ 
           display: 'flex', 
           flexDirection: 'column', 
           alignItems: 'center', 
           justifyContent: 'center',
           padding: '48px 32px',
           background: '#ffffff',
           minHeight: 'calc(100vh - 64px)',
           position: 'relative'
         }}>
           <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
             {/* Logo and Title */}
             <div style={{ marginBottom: '56px' }}>
               <div style={{ 
                 background: '#ffffff',
                 borderRadius: '8px',
                 padding: '32px',
                 border: '1px solid #e2e8f0'
               }}>
                 <Space size="large" style={{ marginBottom: '20px' }}>
                   <Avatar 
                     size={72} 
                     style={{ 
                       background: '#667eea'
                     }}
                   >
                     🎵
                   </Avatar>
                   <Title level={1} style={{ 
                     margin: 0, 
                     fontSize: '52px',
                     fontWeight: 700,
                     color: '#667eea'
                   }}>
                     AI {t('title')}
                   </Title>
                   <Avatar 
                     size={72} 
                     style={{ 
                       background: '#764ba2'
                     }}
                   >
                     📝
                   </Avatar>
                 </Space>
                 <Paragraph style={{ 
                   fontSize: '18px', 
                   color: '#64748b',
                   fontWeight: 400,
                   lineHeight: 1.5
                 }}>
                   {t('subtitle')}
                 </Paragraph>
               </div>
             </div>

             {/* Format Options */}
             <Radio.Group 
               defaultValue="website" 
               style={{ 
                 marginBottom: '40px',
                 display: 'flex',
                 justifyContent: 'center'
               }}
               size="large"
             >
               <Radio.Button 
                 value="website"
                 style={{
                   borderRadius: '4px 0 0 4px',
                   height: '40px',
                   display: 'flex',
                   alignItems: 'center',
                   fontWeight: 400,
                   border: '1px solid #d1d5db'
                 }}
               >
                 <FileTextOutlined style={{ marginRight: '8px' }} /> {t('formatOptions.website')}
               </Radio.Button>
               <Radio.Button 
                 value="pdf"
                 style={{
                   borderRadius: '0',
                   height: '40px',
                   display: 'flex',
                   alignItems: 'center',
                   fontWeight: 400,
                   border: '1px solid #d1d5db',
                   borderLeft: 'none',
                   borderRight: 'none'
                 }}
               >
                 <FileTextOutlined style={{ marginRight: '8px' }} /> {t('formatOptions.pdf')}
               </Radio.Button>
               <Radio.Button 
                 value="text"
                 style={{
                   borderRadius: '0 4px 4px 0',
                   height: '40px',
                   display: 'flex',
                   alignItems: 'center',
                   fontWeight: 400,
                   border: '1px solid #d1d5db'
                 }}
               >
                 <EditOutlined style={{ marginRight: '8px' }} /> {t('formatOptions.text')}
               </Radio.Button>
             </Radio.Group>

            {/* URL Input */}
             <Card style={{ 
               marginBottom: '40px', 
               textAlign: 'left',
               borderRadius: '8px',
               border: '1px solid #e2e8f0',
               background: '#ffffff'
             }}>
               <Input
                 size="large"
                 placeholder={t('urlInput.placeholder')}
                 prefix={<LinkOutlined style={{ color: '#667eea' }} />}
                 value={url}
                 onChange={(e) => setUrl(e.target.value)}
                 style={{ 
                   marginBottom: '20px',
                   borderRadius: '4px',
                   border: '1px solid #d1d5db',
                   fontSize: '16px',
                   height: '40px'
                 }}
               />
               
               <Row gutter={16} align="middle">
                 <Col span={6}>
                   <Space>
                     <Text type="secondary">{t('urlInput.language')}</Text>
                     <Select 
                       value={language} 
                       onChange={setLanguage}
                       size="small"
                       style={{ width: 120 }}
                     >
                       <Option value="繁體中文">{t('languages.zh-TW')}</Option>
                       <Option value="簡體中文">{t('languages.zh-CN')}</Option>
                       <Option value="English">{t('languages.en')}</Option>
                     </Select>
                   </Space>
                 </Col>
                 
                 <Col span={9}>
                   <Space>
                     <Text type="secondary">主持人</Text>
                     <Avatar size="small" style={{ backgroundColor: '#d9d9d9' }} />
                     <Select 
                       value={host} 
                       onChange={setHost}
                       size="small"
                       style={{ width: 100 }}
                     >
                       <Option value="林志玲">林志玲</Option>
                       <Option value="其他主持人">其他主持人</Option>
                     </Select>
                   </Space>
                 </Col>
                 
                 <Col span={9}>
                   <Space>
                     <Avatar size="small" style={{ backgroundColor: '#d9d9d9' }} />
                     <Select 
                       value={guest} 
                       onChange={setGuest}
                       size="small"
                       style={{ width: 100 }}
                     >
                       <Option value="馬雲">馬雲</Option>
                       <Option value="其他嘉賓">其他嘉賓</Option>
                     </Select>
                     <Text type="secondary">ⓘ</Text>
                   </Space>
                 </Col>
               </Row>
             </Card>

             {/* Generate Button */}
             <Button 
               type="primary" 
               size="large" 
               block
               style={{ 
                 height: '48px',
                 fontSize: '16px',
                 fontWeight: 500,
                 background: '#667eea',
                 border: 'none',
                 borderRadius: '4px',
                 marginBottom: '48px'
               }}
             >
               ✨ {t('urlInput.generateButton')}
             </Button>
           </div>
           
           {/* Language Switcher - Bottom Left */}
           <div style={{
             position: 'fixed',
             bottom: '24px',
             left: '24px',
             zIndex: 1000
           }}>
             <div style={{
               background: '#ffffff',
               borderRadius: '4px',
               padding: '8px 12px',
               border: '1px solid #e2e8f0',
               display: 'flex',
               alignItems: 'center',
               gap: '8px'
             }}>
               <span style={{ fontSize: '16px' }}>🌐</span>
               <Select
                 value={i18n.language}
                 onChange={handleLanguageChange}
                 size="small"
                 style={{ 
                   width: 120,
                   borderRadius: '4px'
                 }}
                 dropdownStyle={{
                   borderRadius: '4px'
                 }}
               >
                 <Option value="zh-TW">{t('languages.zh-TW')}</Option>
                 <Option value="zh-CN">{t('languages.zh-CN')}</Option>
                 <Option value="en">{t('languages.en')}</Option>
               </Select>
             </div>
           </div>
         </Content>
       </Layout>
     </Layout>
 );
}
