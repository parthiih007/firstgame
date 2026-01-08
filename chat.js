// const mongoose = require('mongoose');

// const chatMessageSchema = new mongoose.Schema({
//   // Store both user IDs in sorted order for consistent lookup
//   participants: {
//     type: [String],
//     required: true,
//     index: true
//   },
//   senderId: {
//     type: String,
//     required: true
//   },
//   senderUsername: {
//     type: String,
//     required: true
//   },
//   message: {
//     type: String,
//     required: true,
//     maxlength: 500
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//     index: true
//   }
// });

// // Create compound index for efficient chat history retrieval
// chatMessageSchema.index({ participants: 1, timestamp: -1 });

// module.exports = mongoose.model('ChatMessage', chatMessageSchema);

const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  // Store both user IDs in sorted order for consistent lookup
  participants: {
    type: [String],
    required: true,
    index: true
  },
  senderId: {
    type: String,
    required: true
  },
  senderUsername: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Create compound index for efficient chat history retrieval
chatMessageSchema.index({ participants: 1, timestamp: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);