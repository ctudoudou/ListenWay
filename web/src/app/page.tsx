'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  Radio} from 'antd';
import {
  SearchOutlined,
  SoundOutlined,
  FileTextOutlined,
  EditOutlined,
  LinkOutlined
} from '@ant-design/icons';
import '../i18n';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function Home() {
  const { t, i18n } = useTranslation();
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('繁體中文');
  const [host, setHost] = useState('某人');
  const [guest, setGuest] = useState('某人');

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const audioList = [
    { title: '【聲明】example1...', duration: '05:19', date: '16/07/2025' },
    { title: '【聲明】example2...', duration: '04:36', date: '16/07/2025' },
    { title: '【聲明】example3...', duration: '06:22', date: '16/07/2025' },
    { title: '【聲明】example4...', duration: '05:02', date: '16/07/2025' }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          {t('title')}
        </Title>
        <Space>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            size="small"
            style={{ width: 120 }}
          >
            <Option value="zh-TW">{t('languages.zh-TW')}</Option>
            <Option value="zh-CN">{t('languages.zh-CN')}</Option>
            <Option value="en">{t('languages.en')}</Option>
          </Select>
        </Space>
      </Header>

      <Layout>
         <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
           <div style={{ padding: '16px' }}>
             <Input
               placeholder={t('search')}
               prefix={<SearchOutlined />}
               style={{ marginBottom: '24px' }}
             />
             
             <div style={{ marginBottom: '24px' }}>
               <Title level={5} style={{ marginBottom: '12px' }}>{t('audioList.title')}</Title>
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
           
           <div style={{ 
             position: 'absolute', 
             bottom: '16px', 
             left: '16px', 
             right: '16px' 
           }}>
             <Space>
               <span>🌐</span>
               <Text type="secondary">{t(`languages.${i18n.language}`)}</Text>
             </Space>
           </div>
         </Sider>

        <Content style={{ 
           display: 'flex', 
           flexDirection: 'column', 
           alignItems: 'center', 
           justifyContent: 'center',
           padding: '48px 24px',
           background: '#fafafa'
         }}>
           <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
             {/* Logo and Title */}
             <div style={{ marginBottom: '48px' }}>
               <Space size="large" style={{ marginBottom: '16px' }}>
                 <Avatar 
                   size={64} 
                   style={{ 
                     background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7a45 100%)'
                   }}
                 >
                   🎵
                 </Avatar>
                 <Title level={1} style={{ margin: 0, fontSize: '48px' }}>
                   AI <span style={{ 
                     background: 'linear-gradient(135deg, #fa8c16 0%, #ff4d4f 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent'
                   }}>{t('title')}</span>
                 </Title>
                 <Avatar 
                   size={64} 
                   style={{ backgroundColor: '#1890ff' }}
                 >
                   📝
                 </Avatar>
               </Space>
               <Paragraph style={{ fontSize: '18px', color: '#666' }}>
                 {t('subtitle')}
               </Paragraph>
             </div>

             {/* Format Options */}
             <Radio.Group defaultValue="website" style={{ marginBottom: '32px' }}>
               <Radio.Button value="website"><FileTextOutlined /> {t('formatOptions.website')}</Radio.Button>
               <Radio.Button value="pdf"><FileTextOutlined /> {t('formatOptions.pdf')}</Radio.Button>
               <Radio.Button value="text"><EditOutlined /> {t('formatOptions.text')}</Radio.Button>
             </Radio.Group>

            {/* URL Input */}
             <Card style={{ marginBottom: '32px', textAlign: 'left' }}>
               <Input
                 size="large"
                 placeholder={t('urlInput.placeholder')}
                 prefix={<LinkOutlined />}
                 value={url}
                 onChange={(e) => setUrl(e.target.value)}
                 style={{ marginBottom: '16px' }}
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
                 height: '56px',
                 fontSize: '18px',
                 background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
                 border: 'none',
                 marginBottom: '48px'
               }}
             >
               ✨ {t('urlInput.generateButton')}
             </Button>
           </div>
         </Content>
       </Layout>
     </Layout>
 );
}
