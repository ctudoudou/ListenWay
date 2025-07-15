# ListenWay Browser Extension

基于 Node.js 开发的浏览器插件项目。

## 项目结构

```
browser-extension/
├── src/
│   ├── manifest.json    # 插件配置文件
│   ├── background.js    # 后台脚本
│   ├── content.js       # 内容脚本
│   ├── popup.html       # 弹窗界面
│   ├── popup.js         # 弹窗脚本
│   └── icons/           # 图标目录
├── dist/                # 打包输出目录
├── webpack.config.js    # Webpack 配置
└── package.json         # 项目配置
```

## 开发命令

### 安装依赖
```bash
yarn install
```

### 开发模式（监听文件变化）
```bash
yarn dev
```

### 生产构建
```bash
yarn build
```

### 打包插件（构建 + 压缩）
```bash
yarn package
```

## 安装插件

1. 运行 `yarn build` 构建插件
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`
3. 开启「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择项目的 `dist` 目录

## 功能特性

- ✅ Manifest V3 支持
- ✅ 后台脚本（Service Worker）
- ✅ 内容脚本注入
- ✅ 弹窗界面
- ✅ Webpack 打包
- ✅ 开发模式热更新
- ✅ 一键打包部署

## 开发说明

- `src/background.js`: 处理插件后台逻辑
- `src/content.js`: 注入到网页中的脚本
- `src/popup.html/js`: 点击插件图标时显示的弹窗
- `src/manifest.json`: 插件的配置和权限声明