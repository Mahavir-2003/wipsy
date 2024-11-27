import { NextResponse } from 'next/server';
import Chat from '@/app/models/chats';
import { connectDB } from '@/app/lib/mongodb';

export async function POST(req) {
  try {
    await connectDB();
    const { action, chatID, password } = await req.json();

    const chat = await Chat.findOne({ chatID });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Verify admin password against environment variable
    if (password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    switch (action) {
      case 'makeTemporary':
        chat.isPermanent = false;
        chat.createdAt = new Date(); // Reset TTL
        await chat.save();
        return NextResponse.json({ message: 'Chat set to temporary' });

      case 'makePermanent':
        chat.isPermanent = true;
        await chat.save();
        return NextResponse.json({ message: 'Chat set to permanent' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 