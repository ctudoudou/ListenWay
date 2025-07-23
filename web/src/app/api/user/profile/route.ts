import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - 获取用户个人信息
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            podcasts: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// PUT - 更新用户个人信息
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    // 验证必填字段
    if (!name || !email) {
      return NextResponse.json(
        { error: '用户名和邮箱不能为空' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已被其他用户使用
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.user.id
        }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被其他用户使用' },
        { status: 400 }
      )
    }

    // 准备更新数据
    const updateData: {
      name: string
      email: string
      updatedAt: Date
    } = {
      name,
      email,
      updatedAt: new Date()
    }

    // 如果要更新密码
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: '请输入当前密码' },
          { status: 400 }
        )
      }

      // 验证当前密码
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true }
      })

      if (!currentUser || !currentUser.password || !await bcrypt.compare(currentPassword, currentUser.password)) {
        return NextResponse.json(
          { error: '当前密码不正确' },
          { status: 400 }
        )
      }

      // 验证新密码强度
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: '新密码至少需要6个字符' },
          { status: 400 }
        )
      }

      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            podcasts: true
          }
        }
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}