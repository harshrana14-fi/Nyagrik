import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [messageSchema],
});

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
