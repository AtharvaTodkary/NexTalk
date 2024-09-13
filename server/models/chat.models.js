const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        isGroupChat:{
            type: Boolean,
            default: false,
        },
        lastMessages:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatMessage",
        },
        participants:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        admin:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },{
        timestamps: true
    }
);

module.exports = mongoose.model("Chat", chatSchema);
