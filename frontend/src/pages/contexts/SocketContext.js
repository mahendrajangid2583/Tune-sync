import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Create the context
const SocketContext = createContext();
export const SocketProvider = ({ children }) => {

  const host = process.env.REACT_APP_HOST;
  const socket = io(host);

  useEffect(() => {
    const fatch = async () => {
      const user = await JSON.parse(localStorage.getItem("user"));
      
      if (user) {
        socket.emit("add-user", user._id);
      }
    };
    fatch();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook for using socket
export const useSocket = () => {
  const context = useContext(SocketContext);
    if (!context) {
      throw new Error("useProfile must be used within a profileProvider");
    }
    return context;
};
