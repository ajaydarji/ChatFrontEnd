import { getColor } from "@/lib/utils";
import { userAppStore } from "@/store";
import { Host } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

function ContactList({ contacts, isChannel = false }) {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessage,
  } = userAppStore();

  const handleClick = (contact) => {
    console.log(contact);

    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
      setSelectedChatData(contact);

      if (selectedChatData && selectedChatData._id !== contact._id) {
        setSelectedChatMessage([]); // Clear messages if switching contact
      }
    }
  };

  // const getColor = (color) => {
  //   return color ? `bg-${color}-500` : "bg-purple-400 ";
  // };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => handleClick(contact)} // Attach click handler
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer rounded-full ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-purple-950  hover:bg-purple-650"
              : "hover:bg-purple-800"
          }`}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${Host}/${contact.image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-10 w-10 rounded-full text-lg flex items-center justify-center border-[1px] ${getColor(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName[0]
                      : contact.email?.[0]}
                  </div>
                )}
              </Avatar>
            )}
            <span>{contact.firstName || contact.email}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
