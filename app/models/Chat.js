import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chatID: {
    type: String,
    required: true,
    unique: true,
  },
  chatHistory: [{
    message: String,
    uploads: [{
      id: String,
      type: String,
      name: String,
      url: String,
      uuid: String // Store Uploadcare UUID for deletion
    }]
  }],
  isPermanent: {
    type: Boolean,
    default: false
  },
  creationTime: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

chatSchema.index({ creationTime : 1 }, { expireAfterSeconds: 86400 });

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema); 