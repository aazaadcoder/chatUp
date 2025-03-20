import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (uri) => {
    try {
      console.log("env: ",  uri)
      const db =  await mongoose.connect(process.env.MONGODB_URI || uri);
      console.log(`MongoDB connected: ${db.connection.host}`)
    } catch (error) {
        console.log(`unable to connect to db: ${error}`)
    }
}