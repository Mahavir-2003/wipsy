import connectDB from "@/app/lib/dbConnect";
import Chat from "@/app/models/chats";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    await connectDB();
    const data = await req.json();
    const { chatID } = data;
    console.log(chatID);

    if (!chatID) {
        return NextResponse.json({ error: "chatID is required" }, {status: 400});
    }
    // Find the chat with the given ID and if not found, create a new chat with the given ID
    try{
        var chat = await Chat.findOne({ chatID });

        if(!chat){
            chat = await Chat.create({ chatID });
        }
        return NextResponse.json({chatHistory :  chat.chatHistory }, {status: 200});
    }catch(err){
        console.log(err);
        return NextResponse.json({ error: "Error fetching chat" }, {status: 500});
    }

};