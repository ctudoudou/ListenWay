import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/dashboard - 获取仪表板数据
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 获取基础统计数据
    const [totalUsers, totalPodcasts, totalViews, totalDownloads] = await Promise.all([
      prisma.user.count(),
      prisma.podcast.count(),
      prisma.podcast.aggregate({
        _sum: {
          views: true
        }
      }),
      prisma.podcast.aggregate({
        _sum: {
          downloads: true
        }
      })
    ])

    // 获取最新用户（最近5个）
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // 获取最新播客（最近5个）
    const recentPodcasts = await prisma.podcast.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        }
      }
    })

    // 模拟系统健康状态（实际项目中可以从系统监控获取）
    const systemHealth = {
      cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
      memory: Math.floor(Math.random() * 40) + 30, // 30-70%
      storage: Math.floor(Math.random() * 50) + 25 // 25-75%
    }

    const dashboardData = {
      totalUsers,
      totalPodcasts,
      totalViews: totalViews._sum.views || 0,
      totalDownloads: totalDownloads._sum.downloads || 0,
      systemHealth,
      recentUsers,
      recentPodcasts
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: '获取仪表板数据失败' }, { status: 500 })
  }
}