import connectDB from '../../lib/dbConnect';
import Chat from '../../models/Chat';
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    const data = await req.json();
    const { chatID } = data;

    if (!chatID) {
        return NextResponse.json({ error: "chatID is required" }, {status: 400});
    }

    try {
        var chat = await Chat.findOne({ chatID });

        if(!chat) {
            chat = await Chat.create({ chatID });
        }
        
        return NextResponse.json({ 
            chatHistory: chat.chatHistory,
            chat: {
                createdAt: chat.createdAt
            }
        }, {status: 200});
    } catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Error fetching chat" }, {status: 500});
    }
}