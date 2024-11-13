import React, { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import Lottie from "lottie-react";
import { animationDefaultOptions, getColor } from "@/lib/utils";

import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { userAppStore } from "@/store";
import apiClient from "@/lib/api-client";

export default function NewDm() {
  const { setSelectedChatType, setSelectedChatData } = userAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const Host = "https://your-image-host.com"; // Define Host here

  // Search function for filtering contacts
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { search: searchTerm },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        } else {
          setSearchedContacts([]); // Reset contacts if no match is found
        }
      } else {
        setSearchedContacts([]); // Clear results when searchTerm is empty
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      setSearchedContacts([]); // Reset on error
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType(contact);
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#a699c0] border-none mb-2 p-3">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-green-200 text-zinc-900 w-auto h-auto border-none">
          <DialogHeader>
            <DialogTitle>Select a New Contact</DialogTitle>
            <DialogDescription>
              Choose a contact from the list below to start a new direct
              message.
            </DialogDescription>
          </DialogHeader>

          <div>
            <input
              type="text"
              placeholder="Search Contact"
              className="rounded-lg bg-zinc-600 border-none px-2 w-full h-10 text-teal-200"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length === 0 ? (
            <div className="flex flex-col justify-center items-center w-full h-full">
              <Lottie
                animationData={animationDefaultOptions.animationData}
                loop={true}
                autoplay={true}
                style={{ height: "100px", width: "100px" }}
              />
              <div className="text-opacity-80 flex flex-col gap-5 items-center lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-semibold">
                  Hi<span className="text-purple-500">!</span> Search for a new{" "}
                  <span className="text-purple-500">Contact</span>
                </h3>
              </div>
            </div>
          ) : (
            <ScrollArea className="max-h-64 mt-4">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => {
                  const { firstName, lastName, email, image, color } = contact;

                  return (
                    <div
                      key={contact._id}
                      className="p-2 hover:bg-zinc-400 cursor-pointer  rounded-full"
                      onClick={() => selectNewContact(contact)}
                    >
                      <div className="flex gap-3 items-center">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          {image ? (
                            <AvatarImage
                              src={`${Host}/${image}`}
                              alt="Profile"
                              className="object-cover w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`uppercase h-full w-full text-lg rounded-full flex items-center justify-center border-[1px] ${getColor(
                                color
                              )}`}
                            >
                              {firstName ? firstName[0] : email?.[0]}
                            </div>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          {firstName && lastName ? (
                            <span className="text-zinc-900 text-sm font-medium">
                              {`${firstName} ${lastName}`}
                            </span>
                          ) : null}
                          <span className="text-sm">{email}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
