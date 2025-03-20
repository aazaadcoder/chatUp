import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  ischeckingAuth: true,
  onlineUsers : [],
  socket : null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });

    } catch (error) {
      console.log("Error in checkAuth: ", error.message);
      set({ authUser: null });
    } finally {
      set({ ischeckingAuth: false });
    }
  },

  signup: async (fromData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", fromData);
      set({ authUser: response.data });
      

      toast.success("Account Created Successfully");

      get().connectSocket();

    } catch (error) {
        console.log(error);
      toast.error(error.response?.data?.message || "Internal Server Errror");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout : async () => {
    try {
        await axiosInstance.post("/auth/logout");
        set({authUser : null});
        toast.success("LoggedOut Successfully");

        get().disconnectSocket();
    } catch (error) {
        toast.error(error.response?.data?.message || "Internal Server Errror");        
    }
  },

  login : async (formData) => {
    set({isLoggingIn : true})
    try {
        const response = await axiosInstance.post("/auth/login", formData);
        set({authUser : response.data});

        toast.success("Successfully Logged In");

        get().connectSocket();

    } catch (error) {
        toast.error(error.response?.data?.message || "Internal Server Errror");
    } finally {
        set({isLoggingIn : false});
    }
  },

  updateProfile : async (data) => {
    set({isUpdatingProfile : true})
    try {
        const response = await axiosInstance.put("/auth/update-profile", data);

        set({authUser :response.data });

        toast.success("Successfully updated the Profile Picture");

    } catch (error) {
        toast.error(error.response?.data?.message || "Internal Server Errror");
    } finally {
        set({isUpdatingProfile : false});
    }
  },

  connectSocket : () => {
    if(!get().authUser || get().socket?.connected) return ; 
  
    const socket = io(BASE_URL, {
      query : {
        userId: get().authUser._id
      }
    });
    socket.connect();
    set({socket});

    socket.on("getOnlineUsers", (onlineUserIds)=> {
      set({onlineUsers : onlineUserIds});
    })

    
  },

  disconnectSocket : () => {
    if(get().socket?.connected) get().socket.disconnect(); 


  }

}));
