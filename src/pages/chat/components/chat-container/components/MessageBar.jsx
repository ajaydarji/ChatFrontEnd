import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";

import { userAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

function MessageBar() {
  const { selectedChatType, selectedChatData, userInfo } = userAppStore();
  const socket = useSocket();
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  // Add emoji to the message
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  // Handle sending a message
  const handleSentMessage = async () => {
    if (!message.trim()) {
      console.log("Message is empty");
      return;
    }

    // Assuming selectedChatType has a 'chatType' field
    if (selectedChatData && selectedChatType) {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
      setMessage(""); // Clear the message after sending
    } else {
      console.log(new Error("Invalid chat type"));
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    const token = localStorage.getItem("token");
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData(); // Correct formData
        formData.append("file", file);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          headers: {
            token: token, // Include the token in the headers
          },
        });

        console.log(response);

        if (response.status === 200 && response.data) {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl: response.data.filePath,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[10vh] bg-zinc-800 flex items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-zinc-600 rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-white"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className=" text-2xl text-fuchsia-600" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className=" text-2xl text-yellow-600" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            {emojiPickerOpen && (
              <EmojiPicker theme="dark" onEmojiClick={handleAddEmoji} />
            )}
          </div>
        </div>
      </div>
      <button
        className="bg-purple-600 rounded-xl flex items-center justify-center p-5 hover:bg-green-400 focus:bg-green-400 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSentMessage} // Pass the current message state
      >
        <IoSend className=" text-2xl " />
      </button>
    </div>
  );
}

export default MessageBar;
