"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Chat = {
  _id: string;
   participants: string[];
};

type User = {
  _id: string;
  fullName: string;
};

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user info
        const userRes = await fetch("/api/me");
        const userData = await userRes.json();
        const userId = userData._id;
        setCurrentUserId(userId);

        // Get all chats for this user
        const chatRes = await fetch("/api/chats");
        const chatData = await chatRes.json();
        const chatsFetched: Chat[] = chatData.chats || [];
        setChats(chatsFetched);

        // Extract all "other" user IDs from chats
        const otherUserIds = chatsFetched.flatMap((chat) =>
          chat.participants
            .map((id) => id.toString())
            .filter((id) => id !== userId)
        );

        // Fetch user details (names) for those IDs
        const userDetailsRes = await fetch("/api/user/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: otherUserIds }),
        });

        const userList: User[] = await userDetailsRes.json();
        const userMap = Object.fromEntries(
          userList.map((user) => [user._id, user.fullName || "Client"])
        );

        setUserMap(userMap);
      } catch (err) {
        console.error("Failed to load chat list", err);
      }
    };

    fetchData();
  }, []);

  if (!chats.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No messages yet. Try starting a chat from a client account first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chats.map((chat) => {
        const otherUserId = chat.participants
          .map((id) => id.toString())
          .find((id) => id !== currentUserId);

        const otherUserName = userMap[otherUserId!] || "Client";

        return (
          <Link
            key={chat._id}
            href={`/chat/${chat._id}`}
            className="block border p-4 rounded-lg hover:bg-gray-50 shadow-sm"
          >
            💬 Chat with {otherUserName}
          </Link>
        );
      })}
    </div>
  );
};

export default ChatList;
