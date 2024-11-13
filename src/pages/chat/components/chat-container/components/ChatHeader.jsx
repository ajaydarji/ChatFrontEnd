import { getColor } from "@/lib/utils";
import { userAppStore } from "@/store";
import { Host } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { RiCloseFill } from "react-icons/ri";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = userAppStore();

  // Adding check for selectedChatData being undefined
  if (!selectedChatData) {
    return (
      <div className="h-[10vh] border-b-2 border-zinc-500 flex items-center justify-between px-20">
        <div className="flex gap-5 items-center justify-center w-full rounded-full px-5">
          <p className="text-neutral-500">No chat selected</p>
        </div>
      </div>
    );
  }

  const { firstName, lastName, email, image, color, name } = selectedChatData;

  return (
    <div className="h-[10vh] border-b-2 border-zinc-500 flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-center w-full rounded-full px-5">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex gap-3 items-center">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-auto">
                {image ? (
                  <AvatarImage
                    src={`${Host}/${image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`rounded-full uppercase h-full w-full text-lg flex items-center justify-center border-[1px] ${getColor(
                      color
                    )}`}
                  >
                    {firstName ? firstName[0] : email?.[0]}
                  </div>
                )}
              </Avatar>
            ) : (
              <div
                className={`bg-[#ffffff22] py-3 px-5 flex items-center justify-center rounded-full`}
              >
                {name ? name[0] : "#"} {/* Display channel name or default */}
              </div>
            )}

            <div>
              {selectedChatType === "channel" && name}
              {selectedChatType === "contact" && firstName && lastName
                ? `${firstName} ${lastName}`
                : ""}
            </div>
          </div>
        </div>
        <div className="flex gap-5 px-20 items-center justify-center">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
