import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

// ⬅ المسار الصحيح لملف users.json داخل مجلد data على جذر المشروع
const filePath = path.join(process.cwd(), 'data', 'users.json')

// ⬅ إنشاء الملف إذا لم يكن موجودًا
function readUsers() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, '[]') // ملف جديد فاضي
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

// ⬅ كتابة المستخدمين داخل الملف
function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
}

// ⬅ جلب كل المستخدمين
export async function GET() {
  try {
    const users = readUsers()
    console.log(users)
    return NextResponse.json(users)
  } catch (error) {
    console.error('GET error:', error)
    return new NextResponse('Server error', { status: 500 })
  }
}

// ⬅ إضافة مستخدم جديد
export async function POST(request) {
  try {
    const body = await request.json()
    console.log('POST body:', body)

    const users = readUsers()

    const newUser = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
    }

    users.push(newUser)
    writeUsers(users)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return new NextResponse('Server error', { status: 500 })
  }
}

// ⬅ حذف مستخدم
export async function DELETE(request) {
  try {
    const body = await request.json()
    const users = readUsers()
    const updatedUsers = users.filter((user) => user.id !== body.id)
    writeUsers(updatedUsers)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return new NextResponse('Server error', { status: 500 })
  }
}
