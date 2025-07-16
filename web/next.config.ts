import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    'antd',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table'
  ],
  experimental: {
    optimizePackageImports: ['antd']
  }
};

export default nextConfig;
