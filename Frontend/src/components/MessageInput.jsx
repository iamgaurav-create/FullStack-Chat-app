import React, { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { userAuthStore } from '../store/userAuthStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const sendMessage = useChatStore((state) => state.sendMessage);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const authUser = userAuthStore((state) => state.authUser);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !imagePreview) return;

    if (!authUser || !selectedUser) {
      toast.error("Missing sender or receiver");
      return;
    }

    try {
      await sendMessage({
        senderId: authUser._id,
        receiverId: selectedUser._id,
        text: text.trim(),
        image: imagePreview,
      });

      setText('');
      removeImage();
    } catch (err) {
      console.error("Send message failed:", err);
      toast.error("Message send failed");
    }
  };

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="preview"
              className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
            />
            <button
              onClick={removeImage}
              className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center'
              type='button'
            >
              <X className='size-5' />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input
            type='text'
            className='w-full input input-bordered rounded-lg input-sm sm:input-md'
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type='button'
            className={`hidden sm:flex btn-circle p-2 cursor-pointer ${imagePreview ? "text-green-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={24} />
          </button>
        </div>
        <button
          type='submit'
          className="hidden sm:flex btn-circle"
          disabled={!text && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
