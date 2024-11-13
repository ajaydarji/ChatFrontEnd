import apiClient from "@/lib/api-client";
import { userAppStore } from "@/store";
import {
  DELETE_FILES_ROUTE,
  GET_ALL_MESSAGES_ROUTE,
  Host,
} from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowRoundDown } from "react-icons/io"; // Use correct path
import { IoCloseSharp } from "react-icons/io5";

function MessageContainer() {
  const scrollRef = useRef();
  const {
    userInfo,
    selectedChatData,
    setSelectedChatMessage,
    selectedChatMessage,
  } = userAppStore();
  console.log("message:", selectedChatData);

  const [showImage, setshowImage] = useState(false);
  const [imageUrl, setimageUrl] = useState(null);

  // Fetch messages for the selected chat
  const getMessages = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    const userId = userInfo.id; // Get the user ID from userInfo

    try {
      // Make POST request to get all messages for the selected chat
      const response = await apiClient.post(
        GET_ALL_MESSAGES_ROUTE,
        { id: selectedChatData._id, userId: userId },
        {
          headers: {
            token: token, // Pass the token in the request headers for authorization
          },
        }
      );

      if (response.data.messages) {
        setSelectedChatMessage(response.data.messages); // Update state with retrieved messages
      }
    } catch (error) {
      console.error(error); // Log error if request fails
    }
  };

  useEffect(() => {
    if (selectedChatData._id) {
      getMessages(); // Fetch messages when selectedChatData changes
    }
  }, [selectedChatData, setSelectedChatMessage]);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [selectedChatMessage]);

  // Check if the file is an image
  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|webp|heif)$/i;
    return imageRegex.test(filePath);
  };

  // Download a file from the server
  const downloadFile = async (url) => {
    try {
      // Make GET request to download file as blob
      const response = await apiClient.get(`${Host}/${url}`, {
        responseType: "blob",
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data])); // Create a URL for the blob
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop()); // Set filename for download
      document.body.appendChild(link);
      link.click(); // Trigger download
      link.remove();
      window.URL.revokeObjectURL(urlBlob); // Clean up blob URL
    } catch (error) {
      console.error("File Error", error); // Log error if download fails
    }
  };

  // Delete a message by its ID
  const deleteMessageFile = async (messageId) => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    const userId = userInfo.id;

    try {
      // Make DELETE request to remove the message
      const response = await apiClient.delete(
        `${DELETE_FILES_ROUTE}/${messageId}`,
        {
          headers: {
            token: token, // Pass token in headers for authorization
          },
          data: { userId }, // Pass userId in the data field for DELETE
        }
      );

      console.log("Response", response);

      if (response.data.success) {
        // If deletion is successful, filter out the deleted message
        setSelectedChatMessage((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      } else {
        console.error("Failed to delete the message"); // Log if deletion fails
      }
    } catch (error) {
      console.error("Error deleting message file", error.message); // Log error if request fails
    }
  };

  // Function to render each message
  const renderDMMessage = (message) => {
    return (
      <div
        className={`${
          message.sender === userInfo.id ? "text-right" : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender === userInfo.id
                ? "bg-[#8417ff]/5 text-lime-200 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block rounded-full p-4 my-1 max-w-[50%] break-words font-semibold `}
          >
            {message.content || "No content available"}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block rounded-full overflow-hidden p-4 my-1 max-w-[50%] break-words`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer flex justify-center items-center"
                onClick={() => {
                  setimageUrl(message.fileUrl);
                  setshowImage(true);
                }}
              >
                <img
                  src={`${Host}/${message.fileUrl}`}
                  alt="User attachment"
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <a
                  href={`${Host}/${message.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-200 font-sans underline"
                >
                  <span>{message.fileUrl.split("/").pop()}</span>
                </a>
                <IoMdArrowRoundDown
                  className="bg-black/20 p-2 text-3xl rounded-full hover:bg-black/50 cursor-pointer hover:scale-125 transition-all duration-300 ml-4"
                  onClick={() => downloadFile(message.fileUrl)} // Trigger file download
                />
                {message.sender === userInfo.id && (
                  <IoCloseSharp
                    className="bg-black/20 p-2 text-3xl rounded-full hover:bg-red-500/50 cursor-pointer hover:scale-125 transition-all duration-300 ml-4"
                    onClick={() => deleteMessageFile(message._id)} // Trigger message deletion
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timeStamp).format("LT")}
        </div>
      </div>
    );
  };

  // Render all messages
  const renderMessage = () => {
    let lastDate = null;

    if (!selectedChatMessage || selectedChatMessage.length === 0) {
      return <div className="text-center text-gray-500">No messages yet</div>;
    }

    return selectedChatMessage.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = lastDate !== messageDate;
      if (showDate) lastDate = messageDate;

      return (
        <div
          key={index}
          ref={index === selectedChatMessage.length - 1 ? scrollRef : null}
        >
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {renderDMMessage(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vh] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${Host}/${imageUrl}`}
              alt=""
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-2 text-3xl rounded-full hover:bg-black/50 cursor-pointer hover:scale-125 transition-all duration-300 ml-4"
              onClick={() => downloadFile(imageUrl)} // Trigger image download
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-2 text-3xl rounded-full hover:bg-black/50 cursor-pointer hover:scale-125 transition-all duration-300 ml-4"
              onClick={() => {
                setshowImage(false);
                setimageUrl(null); // Close image view
              }}
            >
              <IoCloseSharp />
            </button>
            <FaTrash
              className="bg-black/20 p-2 text-3xl rounded-full hover:bg-red-500/50 cursor-pointer hover:scale-125 transition-all duration-300 ml-4"
              onClick={() => deleteMessageFile(message._id)} // Trigger image file deletion
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;
