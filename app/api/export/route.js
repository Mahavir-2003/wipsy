import { NextResponse } from 'next/server';
import Chat from '@/app/models/Chat';
import { connectDB } from '@/app/lib/mongodb';
import { jsPDF } from 'jspdf';
import TurndownService from 'turndown';
import showdown from 'showdown';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatID = searchParams.get('chatID');
    const format = searchParams.get('format');

    const chat = await Chat.findOne({ chatID });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const content = chat.chatHistory.map(msg => msg.message).join('\n\n---\n\n');

    switch (format) {
      case 'pdf':
        const doc = new jsPDF();
        doc.setFont('helvetica');
        doc.setFontSize(12);
        
        const splitText = doc.splitTextToSize(content, 180);
        doc.text(splitText, 15, 15);
        
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=chat-export.pdf'
          }
        });

      case 'md':
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/markdown',
            'Content-Disposition': 'attachment; filename=chat-export.md'
          }
        });

      case 'html':
        const converter = new showdown.Converter();
        const html = converter.makeHtml(content);
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': 'attachment; filename=chat-export.html'
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 