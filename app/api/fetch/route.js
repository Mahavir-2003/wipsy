import connectDB from "@/app/lib/dbConnect";
import Chat from "@/app/models/chats";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    await connectDB();
    const data = await req.json();
    const { chatID } = data;

    if (!chatID) {
        return NextResponse.json({ error: "chatID is required" }, {status: 400});
    }
    // Find the chat with the given ID and if not found, create a new chat with the given ID
    try{
        var chat = await Chat.findOne({ chatID });

        if(!chat){
            chat = await Chat.create({ chatID });
        }

        // count remaining time for chat expiry (the chat will expire after 24 hours of creation)
        const currentTime = new Date();
        const expiryTime = new Date(chat.createdAt);
        expiryTime.setHours(expiryTime.getHours() + 24);
        var remainingTime = expiryTime - currentTime;
        // convert to hours:minute format
        const hours = Math.floor(remainingTime / 3600000);
        const minutes = Math.floor((remainingTime % 3600000) / 60000);
        remainingTime = `${hours} hours ${minutes} minutes`;
        
        return NextResponse.json({chatHistory :  chat.chatHistory , expiryTime : remainingTime }, {status: 200});
    }catch(err){
        console.log(err);
        return NextResponse.json({ error: "Error fetching chat" }, {status: 500});
    }

};