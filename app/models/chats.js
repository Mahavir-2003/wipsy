import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    chatID : {
        type: String,
        required: true,
    },
    chatHistory: {
        type: Array,
        default: [],
    },
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;
