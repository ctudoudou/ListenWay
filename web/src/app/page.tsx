'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('繁體中文');
  const [host, setHost] = useState('林志玲');
  const [guest, setGuest] = useState('馬雲');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900">ListenWay 聽程</div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">安裝 ListenWay 聽程功能</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="mb-6">
              <input
                type="text"
                placeholder="搜尋"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">音頻</h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 rounded-md hover:bg-gray-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-xs">🎵</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">【聲明】新增播客 AI 功能教學...</div>
                    <div className="text-xs text-gray-500">05:19 • 16/07/2025</div>
                  </div>
                </div>
                
                <div className="flex items-center p-2 rounded-md hover:bg-gray-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-xs">🎵</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">【聲明】免費支援播客 - 精...</div>
                    <div className="text-xs text-gray-500">04:36 • 16/07/2025</div>
                  </div>
                </div>
                
                <div className="flex items-center p-2 rounded-md hover:bg-gray-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-xs">🎵</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">【聲明】5 個日常生活力...</div>
                    <div className="text-xs text-gray-500">06:22 • 16/07/2025</div>
                  </div>
                </div>
                
                <div className="flex items-center p-2 rounded-md hover:bg-gray-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-xs">🎵</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">【聲明】大腦音樂與學習的功...</div>
                    <div className="text-xs text-gray-500">05:02 • 16/07/2025</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">🌐</span>
              <span>繁體中文（台灣）</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full text-center">
            {/* Logo and Title */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-2xl">🎵</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                  AI <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">播客生成器</span>
                </h1>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center ml-3">
                  <span className="text-white text-2xl">📝</span>
                </div>
              </div>
              <p className="text-gray-600 text-lg">在幾秒鐘內將您的內容轉換成可分享的播客音頻</p>
            </div>

            {/* Format Options */}
            <div className="flex justify-center space-x-4 mb-8">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                📄 網站
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                📺 YouTube
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                📄 PDF / 文檔
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                📝 純文本
              </button>
            </div>

            {/* URL Input */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-500 mr-2">🔗</span>
                <input
                  type="text"
                  placeholder="貼上 URL 到這裡"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 text-lg border-none outline-none placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">語言</span>
                    <select 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option>繁體中文</option>
                      <option>簡體中文</option>
                      <option>English</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">主持人</span>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full mr-1"></div>
                      <select 
                        value={host} 
                        onChange={(e) => setHost(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option>林志玲</option>
                        <option>其他主持人</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-1"></div>
                    <select 
                      value={guest} 
                      onChange={(e) => setGuest(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option>馬雲</option>
                      <option>其他嘉賓</option>
                    </select>
                    <span className="text-gray-400 ml-1">ⓘ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl text-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 mb-8">
              ✨ 立即生成
            </button>

            {/* Templates */}
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 mb-4">數據模板示例</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">📊</span>
                    </div>
                    <span className="font-medium text-gray-900">史丹佛 AI 播客報告 2024</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-red-600 text-sm">📰</span>
                    </div>
                    <span className="font-medium text-gray-900">最新美的新聞：健康與文</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm">🎯</span>
                    </div>
                    <span className="font-medium text-gray-900">大腦專題與中的初訓練營</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">📅</span>
                    </div>
                    <span className="font-medium text-gray-900">6 個日常生活力小貼士</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
