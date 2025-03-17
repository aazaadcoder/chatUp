import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { config } from "dotenv";

config();

export const protectRoute = async (req, res, next)=>{

    try {
        const token = req.cookies["jwt-token"];

        if(!token){
            return res.status(401).json({message : "unauthorized access - no token provided"})
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken){
            return res.status(401).json({message : "unauthorized access - invalid token provided"})
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        if(!user){
            return res.status(404).json({message  : "User Not Found"});
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        return res.status(500).json({message : "Internal Server Error."});
    }
}