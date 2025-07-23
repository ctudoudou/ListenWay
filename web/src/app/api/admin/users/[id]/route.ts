import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/users/[id] - 更新用户
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { name, email, role } = await request.json()
    const userId = params.id

    // 验证必填字段
    if (!name || !email || !role) {
      return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 })
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 检查邮箱是否被其他用户使用
    const emailUser = await prisma.user.findUnique({
      where: { email }
    })

    if (emailUser && emailUser.id !== userId) {
      return NextResponse.json({ error: '邮箱已被其他用户使用' }, { status: 400 })
    }

    // 更新用户
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            podcasts: true
          }
        }
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const userId = params.id

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 防止删除自己
    if (userId === session.user.id) {
      return NextResponse.json({ error: '不能删除自己的账户' }, { status: 400 })
    }

    // 删除用户（级联删除相关数据）
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: '用户删除成功' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 })
  }
}