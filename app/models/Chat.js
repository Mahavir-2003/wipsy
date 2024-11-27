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
  adminPassword: {
    type: String,
    select: false // Hide password from queries by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: function() {
      // If permanent, don't expire; if temporary, expire after 24h
      return this.isPermanent ? undefined : 24 * 60 * 60;
    }
  },
  storageUsed: {
    type: Number,
    default: 0 // Track storage usage in bytes
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Update storage usage when uploads change
chatSchema.pre('save', function(next) {
  if (this.isModified('chatHistory')) {
    this.storageUsed = this.chatHistory.reduce((total, msg) => {
      return total + (msg.uploads?.reduce((size, upload) => {
        return size + (upload.size || 0);
      }, 0) || 0);
    }, 0);
  }
  next();
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema); 