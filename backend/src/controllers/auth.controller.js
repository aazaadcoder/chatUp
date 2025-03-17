import bcrypt from "bcryptjs";
import { generateToken } from "../../lib/utils.js";
import User from "../models/user.model.js";
import bycrpt from "bcryptjs";
import cloudinary from "../../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ messsage: "all fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ messsage: "password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ messsage: "Email Already Exists" });

    const salt = await bycrpt.genSalt(10);
    const hashedPassword = await bycrpt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // we will genrate jwt token

      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser._id,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);

    res.status(500).json({ message: "Internal Server Error." });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {

    if(!email || !password){
        return res.status(400).json({message : "All Fields Required."})
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user._id,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    return res.status(500).json({message : "Internal Server Error"});
  }
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt-token","", {maxAge : 0 });
        return res.status(200).json({message : "Logged Out Successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({message : "Internal Server Error"});
    }
};


export const updateProfile = async(req, res) => {

    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({message : "Profile Pic Required."});
        }

        const uploadResponse = await cloudinary.uploader(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic : uploadResponse.secure_url}, {new : true});

        res.status(200).json({message : "profile pic is required"})


    } catch (error) {
        console.log("error in update profile: ", error.message);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

export const checkAuth = (req , res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        return res.status(500).json({message : "Internal Server Error."});``
    }
}