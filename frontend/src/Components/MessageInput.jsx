import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSendingMessage , setIsSendingMessage] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please Select an Image File");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
      };
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSendingMessage(true);
    if (!text && !imagePreview) return;

    const messageData = {
      text: text.trim(),
      image: imagePreview,
    };

    try {
      await sendMessage(messageData);

      // clear form
      setText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImagePreview(null);

    } catch (error) {
      toast.error("Failed to send the message");
      console.log("failed to send message: ", error.message);
    } finally{
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              type="button"
              className={`absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 ${isSendingMessage ? "disabled" : ""}`}
            >
              <X className={`size-3 ${isSendingMessage ? "disabled" : ""}`} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            onChange={(e) => setText(e.target.value)}
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            value={text}
          />

          <input
            type="file"
            accept="images/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            disabled = {isSendingMessage}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          disabled={(!text && !imagePreview) || isSendingMessage}
          className="btn btn-sm btn-circle"
        >
          <Send />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
