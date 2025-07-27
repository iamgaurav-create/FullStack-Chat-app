import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { userAuthStore } from "../store/userAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    selectedUser,
    isMessagesLoading,
    clearMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const authUser = userAuthStore((state) => state.authUser);

  // Load messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    } else {
      clearMessages();
      unsubscribeFromMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id]);

  if (!selectedUser) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-2 mx-auto">
        <ChatHeader />
        <p className="text-center text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-2 w-[950px] mx-auto">
        <ChatHeader />
        <MessageSkeleton />
         <div className="sticky bottom-0 left-0 right-0 bg-base-100 border-t border-zinc-700">
          <MessageInput />
        </div>
      </div>
    );
  }

  const userMessages = messages[selectedUser._id] || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 w-full sm:w-[500px] md:w-[700px] lg:w-[970px] mx-auto">

      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {userMessages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser?._id
                      ? authUser?.profilePic || "/owl.png"
                      : selectedUser?.profilePic || "/owl.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="sticky -bottom-4 left-0 right-0 bg-base-100 border-t border-zinc-700">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
