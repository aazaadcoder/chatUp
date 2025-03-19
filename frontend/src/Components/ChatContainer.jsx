import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessagesSkelton from "./Skeltons/MessagesSkelton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex  flex-col overflow-auto">
        <ChatHeader />

        <MessagesSkelton />

        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              authUser._id === message.senderId ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  alt="profile picture"
                  src={
                    (message.senderId === authUser._id
                      ? authUser.profilePic
                      : selectedUser.profilePic) || "/avatar.png"
                  }
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img 
                src = {message.image}
                alt="attachment" 
                className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              
              {message.text && <p>{message.text}</p>}</div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
