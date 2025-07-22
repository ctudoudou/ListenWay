import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/podcasts/[id] - 更新播客
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { title, description, status } = await request.json()
    const podcastId = params.id

    // 验证必填字段
    if (!title || !description || !status) {
      return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 })
    }

    // 检查播客是否存在
    const existingPodcast = await prisma.podcast.findUnique({
      where: { id: podcastId }
    })

    if (!existingPodcast) {
      return NextResponse.json({ error: '播客不存在' }, { status: 404 })
    }

    // 更新播客
    const podcast = await prisma.podcast.update({
      where: { id: podcastId },
      data: {
        title,
        description,
        status
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(podcast)
  } catch (error) {
    console.error('Error updating podcast:', error)
    return NextResponse.json({ error: '更新播客失败' }, { status: 500 })
  }
}

// DELETE /api/admin/podcasts/[id] - 删除播客
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const podcastId = params.id

    // 检查播客是否存在
    const existingPodcast = await prisma.podcast.findUnique({
      where: { id: podcastId }
    })

    if (!existingPodcast) {
      return NextResponse.json({ error: '播客不存在' }, { status: 404 })
    }

    // 删除播客
    await prisma.podcast.delete({
      where: { id: podcastId }
    })

    return NextResponse.json({ message: '播客删除成功' })
  } catch (error) {
    console.error('Error deleting podcast:', error)
    return NextResponse.json({ error: '删除播客失败' }, { status: 500 })
  }
}