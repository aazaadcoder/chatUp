import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


export const useChatStore = create ((set) =>({
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
        set({isMessagesLoading : true});

        try {
            const response = await axiosInstance.get(`/messages/:${id}`);

            set({users : response.data})
            
        } catch (error) {
            toast.error(error.response.data.message || "Server Error in Loading Messages")
        } finally {
            set({isMessagesLoading : false});
        }
    },


    // todo : optimize this later 
    setSelectedUser : (selectedUser) =>  set({selectedUser })
    


}));