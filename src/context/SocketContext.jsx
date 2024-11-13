import { userAppStore } from "@/store";
import { Host } from "@/utils/constants";
import { io } from "socket.io-client";
import { createContext, useRef, useContext, useEffect } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const Socket = useRef(null);
  const { userInfo } = userAppStore();

  useEffect(() => {
    if (userInfo) {
      const token = localStorage.getItem("token"); // Get token from localStorage

      Socket.current = io(Host, {
        query: { userId: userInfo.id }, // Pass userId in the query
        auth: { token }, // Use 'auth' to pass the token
        transports: ["websocket", "polling"],
      });
      console.log("Socket.current:", Socket.current);

      Socket.current.on("connect", (message) => {
        console.log(
          "Connected to socket server with userId:",
          userInfo.id,
          message
        );
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          userAppStore.getState();

        // Ensure correct comparison of recipient and sender IDs
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("Message received:", message);
          addMessage(message.content);
        }
      };

      Socket.current.on("receiveMessage", handleReceiveMessage);

      return () => {
        if (Socket.current) {
          Socket.current.disconnect(); // Disconnect on cleanup
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={Socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
