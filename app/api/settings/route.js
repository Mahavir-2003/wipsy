import { NextResponse } from 'next/server';
import Chat from '@/app/models/chats';
import { connectDB } from '@/app/lib/mongodb';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatID = searchParams.get('chatID');

    if (!chatID) {
      return NextResponse.json({ error: 'chatID is required' }, { status: 400 });
    }

    const chat = await Chat.findOne({ chatID });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({
      isPermanent: chat.isPermanent,
      storageUsed: chat.storageUsed
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 