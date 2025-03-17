import mongoose from "mongoose";


const messageSchema = mongoose.Schema({
    senderId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    receiverId:{
        type : mongooseSchema.Types.ObjectId,
        ref : "users",
        required : true
    },
     text : {
        type : String,
    },
    image : {
        type: String,
    }

}, {Timestamps : true})

const Message = mongoose.model("Message", messageSchema);

export default Message;