import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { userAuthStore } from "./userAuthStore";

export const useChatStore = create((set, get) => ({
  messages: {}, // messages per userId: { [userId]: [message1, message2] }
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set((state) => ({
        messages: {
          ...state.messages,
          [userId]: res.data,
        },
      }));
    } catch (error) {
      console.error("Fetch messages error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ senderId, receiverId, text, image }) => {
    try {
      // Send message to backend API
      const res = await axiosInstance.post(`/messages/send/${receiverId}`, {
        senderId,
        text,
        image,
      });

      const message = res.data;

      // Update sender's message list immediately
      set((state) => {
        const senderMessages = state.messages[receiverId] || [];
        return {
          messages: {
            ...state.messages,
            [receiverId]: [...senderMessages, message],
          },
        };
      });

      // Emit message to receiver via socket
      const socket = userAuthStore.getState().socket;
      if (socket) {
        socket.emit("send-message", message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const socket = userAuthStore.getState().socket;
    if (!socket) return;

    socket.on("receive-message", (message) => {
      set((state) => {
        const oldMessages = state.messages[message.senderId] || [];
        return {
          messages: {
            ...state.messages,
            [message.senderId]: [...oldMessages, message],
          },
        };
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = userAuthStore.getState().socket;
    if (socket) socket.off("receive-message");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  clearMessages: () => set({ messages: {} }),
}));
