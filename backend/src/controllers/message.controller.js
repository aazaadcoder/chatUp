import { response } from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose, { mongo } from "mongoose";
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const fliteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(fliteredUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar controller: ", error.message);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const userToChatId = new mongoose.Types.ObjectId(id);
    const myId = new mongoose.Types.ObjectId(req.user._id);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages cotroller: ", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo : realtime functionality to be added  => socket.io

    return res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
