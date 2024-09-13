const mongoose = require('mongoose');

const ChatMessageSchema = mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content:{
            type: String,
        },
        attachments:{
            type:[
                {
                    url: String,
                },
            ],
            default:[],
        },
        chat:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
    },{
        timestamps: true
    }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);