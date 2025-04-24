import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import {
  sendMessage,
  getMessages,
  checkLastOnline,
} from "../../services/operations/messages";

import { useSocket } from "../../pages/contexts/SocketContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Notification from "./Notification";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

const ChatContainer = ({
  currentChat,
  currentUser,
  closeChatBox,
  isChatOpen,
  setNotificationMessage,
}) => {
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (socket && currentChat) {
      socket.emit("check-online", currentChat._id);

      socket.on("user-online-status", ({ userId, isOnline }) => {
        if (userId === currentChat._id) {
          setIsOnline(isOnline);
        }
      });

      socket.on("user-online", (userId) => {
        if (userId === currentChat._id) {
          setIsOnline(true);
        }
      });

      socket.on("user-offline", (userId) => {
        if (userId === currentChat._id) {
          setIsOnline(false);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("user-online-status");
        socket.off("user-online");
        socket.off("user-offline");
      }
    };
  }, [currentChat, socket]);

  const handleSendMsg = async (msg) => {
    socket.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });

    const response = await sendMessage({
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    console.log("send message", response);

    setMessages([...messages, { fromSelf: true, message: msg }]);
  };

  useEffect(() => {
    const fatch = async () => {
      if (currentChat) {
        const response = await checkLastOnline(currentChat._id);
        if(response){
          setLastOnline(response.lastOnline);
        }
      }
    };
    fatch();
  }, [isOnline, currentChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log(currentUser._id, currentChat._id);
      const response = await getMessages({
        from: currentUser._id,
        to: currentChat._id,
      });
      console.log("messages", response);
      if (response.data) setMessages(response.data);
    };
    fetchMessages();
  }, [currentChat]);

  
  const isChatOpenRef = useRef(isChatOpen);
  useEffect(() => {
    // Create a ref to track isChatOpen
  isChatOpenRef.current = isChatOpen; // Update the ref whenever isChatOpen changes

  socket.on("msg-recieve", (msg) => {
    setArrivalMessage({ fromSelf: false, message: msg.msg });
    console.log("bahar", isChatOpenRef.current);
    if (isChatOpenRef.current === false) {
      console.log("andar", isChatOpenRef.current);
      setNotificationMessage(msg);
    }
  });

  return () => {
    socket.off("msg-recieve");
  };

    
  }, [isChatOpen]);

  useEffect(() => {
    if (arrivalMessage) setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format the timestamp using dayjs
  const formattedTime = dayjs(lastOnline ? lastOnline : currentChat.lastOnline).fromNow();

  return (
    <div className="grid  gap-1 h-full overflow-hidden grid-rows-[15%_70%_15%]">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <div onClick={() => closeChatBox(false)}>
            <IoMdArrowRoundBack className="text-white hover:scale-105 hover:text-gray-300 transition-scale duration-200" size={24} size={25} />
          </div>
          <div>
            <img src={currentChat.image} alt="" className="h-12 rounded-full" />
          </div>
          <div>
            <h3 className="text-white text-lg">
              {currentChat.firstName} {currentChat.lastName}
            </h3>
            <span
              className={`${
                isOnline ? "text-green-500" : "text-red-500"
              } text-sm`}
            >
              {isOnline ? "Online" : formattedTime}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 overflow-auto text-white scrollbar-thin scrollbar-thumb-gray-500">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`flex ${
              message.fromSelf ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[40%] px-2 py-1 text-base rounded-lg ${
                message.fromSelf ? "bg-blue-600" : "bg-purple-600"
              }`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
};

export default ChatContainer;
