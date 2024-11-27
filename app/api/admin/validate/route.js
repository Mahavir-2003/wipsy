import { NextResponse } from 'next/server';
import Chat from '@/app/models/chats';
import { connectDB } from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const { chatID, password } = await req.json();

    const chat = await Chat.findOne({ chatID }).select('+adminPassword');
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Verify admin password
    if (!chat.adminPassword || !bcrypt.compareSync(password, chat.adminPassword)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Password valid' });
  } catch (error) {
    console.error('Password validation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 