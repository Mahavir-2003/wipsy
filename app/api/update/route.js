import connectDB from "@/app/lib/dbConnect";
import Chat from "@/app/models/chats";
import { NextResponse } from "next/server";


export async function POST(req, res) {
    await connectDB();
    const data = await req.json();
    const { chatID , chatHistory } = data;

    if (!chatID) {
        return NextResponse.json({ error: "chatID is required" }, {status: 400});
    }

    try{
        // update the chat with the given ID
        var chat = await Chat.findOneAndUpdate({chatID : chatID}, {chatHistory : chatHistory}, {new: true});

        if(!chat){
            return NextResponse.json({ error: "Chat not found" }, {status: 404});
        }

        return NextResponse.json({chatHistory :  chat.chatHistory }, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({ error: "Error updating chat" }, {status: 500});
    }
    
};
