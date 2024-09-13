const mongoose = require('mongoose');
const constants = require('../constants')

const userSchema = mongoose.Schema(
    {
        avatar: {
            type: {
                url: String,
            },
            default:{
                url:'https://i.pinimg.com/736x/6e/1d/aa/6e1daa9dc3ea37be98f47a69725d0684.jpg',
            }
        },
        username:{
            type:String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password:{
            type: String,
            required: [true, "Password is Required"],
        },
        role:{
            type: String,
            enum: constants.AvailableUserRoles,
            default: constants.UserRolesEnum.USER,
            required: true,
        }
    },{ timestamps: true }
);

module.exports = mongoose,model("Users", userSchema)