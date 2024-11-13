import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  CREATE_CHANNEL,
  GET_ALL_CONTACTS,
  SEARCH_CONTACTS_ROUTES,
} from "@/utils/constants";

import { userAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";

export default function CreateChannel() {
  const { addChannel, selectedChatType, setSelectedChatType, userInfo } =
    userAppStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const socket = useSocket();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getData = async () => {
      if (!token) {
        console.error("No token found. Unable to fetch contacts.");
        return; // Exit if there's no token
      }

      try {
        const response = await apiClient.get(GET_ALL_CONTACTS, {
          headers: {
            token: token, // Include the token in the headers
          },
        });

        if (response.status === 200 && response.data.contacts) {
            setAllContacts(response.data.contacts);
        } else {
          console.error("Failed to fetch contacts:", response.data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    getData();
  }, []); // Empty dependency array ensures this runs only on mount

  const createChannel = async () => {
    if (!channelName || selectedContacts.length === 0) {
      alert("Please provide a channel name and select contacts.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = userInfo.id;
      console.log(userId);

      const response = await apiClient.post(
        CREATE_CHANNEL,
        {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value), // Assuming `contact.value` is the contact ID
          userId: userId,
        },
        {
          headers: {
            token: token, // Include token for authentication
          },
        }
      );

      if (response.status === 201) {
        addChannel(response.data.channel); // Add the new channel to state
        setChannelName(""); // Reset channel name
        setSelectedContacts([]); // Clear selected contacts
        setNewChannelModal(false); // Close modal

        socket.emit("add-channel-notify", response.data.channel);
      }
    } catch (error) {
      console.error("Failed to create channel", error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className=" text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogDescription className="hidden">
          Please insert details
        </DialogDescription>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-max flex flex-col">
          <DialogHeader>
            <DialogTitle>Create a new Channel</DialogTitle>
          </DialogHeader>
          <div>
            <input
              placeholder="Channel Name"
              className="rounded-lg py-4 px-4 bg-[#2c2e3b] border-none"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  No results found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              onClick={createChannel}
              className=" w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
