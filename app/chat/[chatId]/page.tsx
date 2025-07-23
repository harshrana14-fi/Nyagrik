"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  Download,
  Reply,
  Copy,
  Trash2,
  Star,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  MicOff,
  FileText,
  X,
} from "lucide-react";

type Message = {
  _id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type?: "text" | "file" | "voice" | "image";
  fileUrl?: string;
  fileName?: string;
  isRead?: boolean;
  isDelivered?: boolean;
  replyTo?: string;
  isStarred?: boolean;
  duration?: number; // for voice messages
};

type User = {
  _id: string;
  fullName: string;
  profileImage?: string;
  role: "lawyer" | "client";
  isOnline?: boolean;
  lastSeen?: string;
};

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Emoji data
  const emojis = [
    "😀",
    "😂",
    "🥰",
    "😍",
    "🤔",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "💯",
    "😢",
    "😡",
    "🎉",
    "👏",
    "🙏",
  ];

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    fetchUserAndMessages();
    // Simulate online status updates
    const interval = setInterval(() => {
      if (otherUser && Math.random() > 0.7) {
        setOtherUser((prev) =>
          prev ? { ...prev, isOnline: !prev.isOnline } : null
        );
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (newMsg.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [newMsg]);

  const fetchUserAndMessages = async () => {
    try {
      const userRes = await fetch("/api/me");
      const me = await userRes.json();
      setCurrentUser(me);

      const chatRes = await fetch(`/api/chat/${chatId}`);
      const chatData = await chatRes.json();

      // Simulate message status and add mock data
      const enhancedMessages = (chatData.messages || []).map(
        (msg: Message) => ({
          ...msg,
          isDelivered: true,
          isRead: Math.random() > 0.3,
          isStarred: Math.random() > 0.8,
        })
      );

      setMessages(enhancedMessages);

      const otherId = chatData.participants.find((id: string) => id !== me._id);

      const userDetails = await fetch("/api/user/list", {
        method: "POST",
        body: JSON.stringify({ ids: [otherId] }),
        headers: { "Content-Type": "application/json" },
      });

      const userList: User[] = await userDetails.json();
      setOtherUser({
        ...userList[0],
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      });
    } catch (err) {
      console.error("Failed to load chat", err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !currentUser) return;

    const tempMsg: Message = {
      _id: Date.now().toString(),
      senderId: currentUser._id,
      text: newMsg,
      timestamp: new Date().toISOString(),
      isDelivered: false,
      isRead: false,
      replyTo: replyingTo?._id,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMsg("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
    scrollToBottom();

    await fetch(`/api/chat/${chatId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: currentUser._id,
        text: newMsg,
        replyTo: replyingTo?._id,
      }),
    });

    fetchUserAndMessages();
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "image" = "file"
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", currentUser._id);
    formData.append("type", type);

    setShowAttachMenu(false);

    await fetch(`/api/chat/${chatId}/message`, {
      method: "POST",
      body: formData,
    });

    fetchUserAndMessages();
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } else {
      return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMsg((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setSelectedMessage(null);
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    setSelectedMessage(null);
  };

  const starMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
    setSelectedMessage(null);
  };

  const getBubbleStyle = (msg: Message) => {
    const isMe = msg.senderId === currentUser?._id;
    return isMe
      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto rounded-tr-sm"
      : "bg-white text-gray-900 mr-auto rounded-tl-sm shadow-sm";
  };

  const getStatusIcon = (msg: Message) => {
    if (msg.senderId !== currentUser?._id) return null;

    if (msg.isRead) {
      return <CheckCheck className="w-4 h-4 text-blue-400" />;
    } else if (msg.isDelivered) {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    } else {
      return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredMessages = searchQuery
    ? messages.filter(
        (msg) =>
          msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const getLastSeenText = () => {
    if (otherUser?.isOnline) return "Online";
    if (otherUser?.lastSeen) {
      const lastSeen = new Date(otherUser.lastSeen);
      const now = new Date();
      const diffInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return formatTime(otherUser.lastSeen);
    }
    return "Offline";
  };

  return (
    
  <div className="flex justify-center items-center h-screen bg-gray-100 px-2">
    <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col relative">
    <div className="flex flex-col h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <button className="md:hidden">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div className="relative">
            <Image
              src={otherUser?.profileImage || "/avatar.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            {otherUser?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">
              {otherUser?.fullName || "Loading..."}
            </p>
            <p className="text-xs text-gray-500">
              {isTyping ? "Typing..." : getLastSeenText()} • {otherUser?.role}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                >
                  {isMuted ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                  <span>{isMuted ? "Unmute" : "Mute"}</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Starred Messages</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-white border-b px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Reply Banner */}
      {replyingTo && (
        <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-blue-600 font-medium">
              Replying to{" "}
              {replyingTo.senderId === currentUser?._id
                ? "yourself"
                : otherUser?.fullName}
            </p>
            <p className="text-sm text-gray-700 truncate">{replyingTo.text}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 hover:bg-blue-100 rounded"
          >
            <X className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scroll-smooth"
      >
        {filteredMessages.map((msg, index) => {
          const isFile = msg.type === "file" || msg.type === "image";
          const isMe = msg.senderId === currentUser?._id;
          const showAvatar =
            !isMe &&
            (index === 0 ||
              filteredMessages[index - 1].senderId !== msg.senderId);
          const showTime =
            index === 0 ||
            new Date(msg.timestamp).getTime() -
              new Date(filteredMessages[index - 1].timestamp).getTime() >
              300000;

          return (
            <div key={msg._id}>
              {showTime && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              )}

              <div
                className={`flex items-end space-x-2 mb-1 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && showAvatar && (
                  <Image
                    src={otherUser?.profileImage || "/avatar.png"}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                )}

                <div
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  } max-w-xs md:max-w-md`}
                >
                  {/* Reply Preview */}
                  {msg.replyTo && (
                    <div className="bg-gray-100 border-l-2 border-blue-500 px-2 py-1 mb-1 rounded text-xs">
                      <p className="text-gray-600 truncate">
                        {messages.find((m) => m._id === msg.replyTo)?.text ||
                          "Original message"}
                      </p>
                    </div>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl relative group ${getBubbleStyle(
                      msg
                    )} ${
                      selectedMessage === msg._id ? "ring-2 ring-blue-300" : ""
                    }`}
                    onClick={() =>
                      setSelectedMessage(
                        selectedMessage === msg._id ? null : msg._id
                      )
                    }
                  >
                    {msg.isStarred && (
                      <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500 fill-current" />
                    )}

                    {isFile ? (
                      <div className="flex items-center space-x-2">
                        {msg.type === "image" ? (
                          <div className="relative">
                            {msg.fileUrl && (
                              <Image
                                src={msg.fileUrl}
                                alt={msg.fileName || "Attachment"}
                                width={192}
                                height={192}
                                className="rounded-lg object-cover"
                                style={{
                                  maxWidth: "12rem",
                                  maxHeight: "12rem",
                                }}
                              />
                            )}
                            <button className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full">
                              <Download className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-8 h-8 text-blue-500" />
                            <div>
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium hover:underline block"
                              >
                                {msg.fileName}
                              </a>
                              <p className="text-xs opacity-70">
                                Click to download
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    )}

                    <div
                      className={`flex items-center justify-end space-x-1 mt-1 ${
                        isMe ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      <span className="text-xs">
                        {formatTime(msg.timestamp)}
                      </span>
                      {getStatusIcon(msg)}
                    </div>

                    {/* Message Actions */}
                    {selectedMessage === msg._id && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border py-1 z-50 min-w-32">
                        <button
                          onClick={() => setReplyingTo(msg)}
                          className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Reply className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                        <button
                          onClick={() => copyMessage(msg.text)}
                          className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => starMessage(msg._id)}
                          className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Star className="w-3 h-3" />
                          <span>{msg.isStarred ? "Unstar" : "Star"}</span>
                        </button>
                        {isMe && (
                          <button
                            onClick={() => deleteMessage(msg._id)}
                            className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isMe && !showAvatar && <div className="w-6" />}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <Image
              src={otherUser?.profileImage || "/avatar.png"}
              alt="Avatar"
              width={24} // Tailwind's w-6 = 1.5rem = 24px
              height={24} // Tailwind's h-6 = 1.5rem = 24px
              className="rounded-full"
            />
            <div className="bg-gray-200 px-3 py-2 rounded-full">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg border p-2 z-50">
          <div className="grid grid-cols-2 gap-2 w-48">
            <button
              onClick={() => imageRef.current?.click()}
              className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-1">
                <Image className="w-5 h-5 text-pink-600" src={""} alt={""} />
              </div>
              <span className="text-xs text-gray-700">Gallery</span>
            </button>

            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-700">Document</span>
            </button>

            <button className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <Camera className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-700">Camera</span>
            </button>

            <button className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-700">Audio</span>
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg border p-3 z-50">
          <div className="grid grid-cols-5 gap-2 w-48">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl p-2 hover:bg-gray-100 rounded-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-end space-x-3">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="text-gray-500 hover:text-blue-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => handleUpload(e, "file")}
            accept=".pdf,.doc,.docx,.txt,.zip"
          />

          <input
            ref={imageRef}
            type="file"
            hidden
            onChange={(e) => handleUpload(e, "image")}
            accept="image/*"
          />

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={newMsg}
              onChange={(e) => {
                setNewMsg(e.target.value);
                // Auto-resize textarea
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full border border-gray-300 rounded-full px-4 py-3 pr-12 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none max-h-32"
              style={{ minHeight: "44px" }}
            />

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {newMsg.trim() ? (
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-full transition-colors ${
                isRecording
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showEmojiPicker || showAttachMenu || showDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowEmojiPicker(false);
            setShowAttachMenu(false);
            setShowDropdown(false);
          }}
        />
      )}


    </div>
  </div>
  </div>
  );
}
