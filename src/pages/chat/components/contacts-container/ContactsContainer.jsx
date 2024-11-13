import ContactList from "@/components/contact";
import ProfileInfo from "./components/ProfileInfo";
import apiClient from "@/lib/api-client";
import { useEffect, useState } from "react";
import { userAppStore } from "@/store";
import NewDM from "./components/NewDm";
import CreateChannel from "./components/create-channel/CreateChannel";
import Logo from "./components/Logo";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS } from "@/utils/constants";

const ContactsContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,

    userInfo,
  } = userAppStore();

  const [loadingContacts, setLoadingContacts] = useState(true);

  const [loadingChannels, setLoadingChannels] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Moved token retrieval here
      try {
        // Fetch direct messages contacts
        const responseContacts = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
          headers: {
            token, // Pass the token in the request headers for authorization
          },
        });
        if (responseContacts.data.contacts) {
          setDirectMessagesContacts(responseContacts.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error); // Removed extra period
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchData();
  }, [setDirectMessagesContacts]);

  useEffect(() => {
    if (userInfo) {
      const fetchChannels = async () => {
        const token = localStorage.getItem("token");
        const userId = userInfo.id;

        try {
          const responseChannels = await apiClient.get(GET_USER_CHANNELS, {
            headers: {
              token,
            },
            params: {
              userId,
            },
          });

          console.log("API Response:", responseChannels);
          if (responseChannels.data.channels) {
            console.log("Fetched Channels:", responseChannels.data.channels);
            setChannels(responseChannels.data.channels);
          }
        } catch (error) {
          console.error("Error fetching channels:", error);
        } finally {
          setLoadingChannels(false);
        }
      };

      fetchChannels();
    }
  }, [userInfo, setChannels]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          {loadingContacts ? (
            <p>Loading contacts...</p>
          ) : (
            <ContactList contacts={directMessagesContacts} />
          )}
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[37vh] overflow-y-auto scrollbar-hidden pb-5">
          {loadingChannels ? (
            <p>Loading channels...</p>
          ) : (
            <ContactList contacts={channels} isChannel />
          )}
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;
