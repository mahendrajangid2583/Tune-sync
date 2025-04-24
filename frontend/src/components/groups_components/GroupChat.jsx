import React, { useEffect, useRef, useState } from "react";
import {
  Users,
  X,
  Send,
  MoreVertical,
} from "lucide-react";
import {
  getGroupMessages,
  sendGroupMessage,
} from "../../services/operations/groups";
import { useGroup } from "../../pages/contexts/GroupContext";
import { useSocket } from "../../pages/contexts/SocketContext";

const GroupChat = ({ closeChat, activeChat }) => {
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage,setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visible,setVisible] = useState(false);
  const { groupState } = useGroup();
  const scrollRef = useRef();
  const socket = useSocket();
 
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getGroupMessages({ groupId: activeChat }, token);
        setMessages(response);
      } catch (error) {
        console.log("Error fetching group messages:", error);
      }
    };
    fetchMessages();
  }, [activeChat, token]);

  // Send a message
  const sendMessage = async (groupId) => {
    if (!newMessage.trim()) return;
    
    
    const newObject = {
      groupId: groupId,
      _id: messages.length+1,
      fromSelf:true,
      sender: { firstName:user.firstName, lastName:user.lastName, image: user.image},
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    socket.emit("send-group-msg",{
      groupId: groupId,
      _id: messages.length+1,
      fromSelf:false,
      sender: { firstName:user.firstName, lastName:user.lastName, image: user.image},
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setMessages([...messages,newObject]);

    const response = await sendGroupMessage(
      { groupId: groupId, message: newMessage },
      token
    );
    setNewMessage("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(()=>{
     socket.on("recieve-group-msg",(data)=>{
      console.log(data);
      setArrivalMessage(data);
     })

     return () => {
      socket.off("recieve-group-msg");
    };
  },[]);

  useEffect(()=>{
    if(arrivalMessage){
       setMessages((prev)=>[...prev,arrivalMessage]);
    }
  },[arrivalMessage]);

  useEffect(()=>{
    setVisible(true);
  },[]);

  const closeBox =()=>{
      setVisible(false);
      setTimeout(()=>{
         closeChat();
      },300);
  }
  

  return (
    <div className={`fixed bottom-0 right-0 w-[450px] h-[600px] bg-gray-900 text-white rounded-tl-xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col transform transition-all duration-500 ease-in-out ${visible ? " translate-y-0":"translate-y-full"} `}>
      {/* Chat header */}
      <div className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Users size={18} />
          </div>
          <div>
            <div className="font-medium">{groupState.groupName}</div>
            <div className="text-xs text-gray-400">
              {messages.length} messages
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <MoreVertical size={16} />
          </button>
          <button
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            onClick={closeBox}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={scrollRef}
        className=" flex-1 px-4 py-3 overflow-y-auto scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col w-full items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <Users size={24} />
            </div>
            <p>No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              ref={scrollRef}
              className={`flex items-start ${
                message.fromSelf ? "justify-end" : "justify-start"
              }`}
            >
              {!message.fromSelf && (
                
                    <img
                      src={message.sender.image}
                      alt={message.sender.firstName}
                      className="w-7 h-7 mr-1 rounded-full object-cover"
                    />
               
              )}
              <div
                className={` relative max-w-[80%] min-w-[30%] rounded-lg px-4 py-2 shadow-md ${
                  message.fromSelf
                    ? "bg-gray-800 rounded-tr-none"
                    : "bg-gray-700 rounded-tl-none"
                }`}
              >
                {!message.fromSelf ? (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-green-600">
                      {message.sender.firstName}
                    </span>
                  </div>
                ) : (
                  <div className="font-medium text-sm text-green-600">You</div>
                )}
                <div className="text-base pr-9">{message.text}</div>
                <div className=" absolute bottom-1 right-1 text-right mt-1">
                  <span className=" text-[10px] opacity-70">{message.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message input */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-full px-3 py-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage(activeChat)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-0 focus:outline-none text-sm py-2"
          />
          <button
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim()
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "text-gray-400 bg-gray-600"
            }`}
            onClick={() => sendMessage(activeChat)}
            disabled={!newMessage.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
