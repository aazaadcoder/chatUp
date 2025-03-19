import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthUser = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  ischeckingAuth: true,

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
  }
}));
