import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event) => {
    setMsg((prev) => prev + event.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="flex items-center gap-3 bg-[#0b0b10] px-3 py-1 md:py-1">
      <div className="relative text-white">
        <BsEmojiSmileFill 
          className="text-yellow-400 text-2xl cursor-pointer" 
          onClick={handleEmojiPickerhideShow} 
        />
        {showEmojiPicker && (
          <div className="absolute top-[-430px] bg-[#080420] shadow-lg border border-[#9a86f3]">
            <Picker 
              theme="dark" 
              height={400} 
              width={300} 
              onEmojiClick={handleEmojiClick} 
            />
          </div>
        )}
      </div>
      <form 
        className="flex items-center w-full bg-white/20 rounded-2xl px-2 py-1 gap-4" 
        onSubmit={sendChat}
      >
        <input
          type="text"
          placeholder="Type your message here"
          className="flex-1 bg-transparent text-white text-base outline-none placeholder-gray-300"
          onChange={(e) => setMsg(e.target.value)}
          onClick={() => setShowEmojiPicker(false)}
          value={msg}
        />
        <button 
          type="submit" 
          className="bg-[#9a86f3] p-2 rounded-2xl flex justify-center items-center hover:bg-[#7a67d3] transition"
        >
          <IoMdSend className="text-white text-2xl" />
        </button>
      </form>
    </div>
  );
}
