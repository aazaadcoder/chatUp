import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create ((set, get) =>({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers: async () => {
        set({isUsersLoading : true});
        try {
            const response = await axiosInstance.get("/messages/user");

            set({users : response.data});
        } catch (error) {
            toast.error(error.response.data.message || "Server Error in fetching Users");
        } finally {
            set({isUsersLoading : false});
        }

    },

    getMessages : async (id)=> {
        const {messages} = get();
        set({isMessagesLoading : true});

        try {
            const response = await axiosInstance.get(`/messages/${id}`);

            set({messages : response.data})
            console.log(messages);
        } catch (error) {
            toast.error(error.response.data.message || "Server Error in Loading Messages")
        } finally {
            set({isMessagesLoading : false});
        }
    },
    sendMessage : async (messageData) =>  {
        const {messages, selectedUser} = get();
        try {
        const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

        set({messages : [...messages, response.data]})
            
        } catch (error) {
            // toast.error(error.response.data.message || "Internal Server Error in Sending the Message")
            throw Error();
        }        
    },
    subscribeToNewMessages : async () => {
        if(!get().selectedUser ) return ; 

        const socket = useAuthStore.getState().socket;
        

        // todo: optimize this later
        socket.on("newMessage", (newMessage) => {
            if(!(get().selectedUser._id === newMessage.senderId)) return ;
            set({messages : [...get().messages, newMessage ]});
        })

    },    
    unSubscribeFromNewMessages : async () => {
        const socket = useAuthStore.getState().socket;

        socket.off("newMessage");
    },

    setSelectedUser : (selectedUser) =>  set({selectedUser }),

}));