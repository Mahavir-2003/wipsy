import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    chatID: {
        type: String,
        required: true,
    },
    chatHistory: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;
