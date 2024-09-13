const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users.models");

const userCtrl = {
  register: async (req, res) => {
    try {
      //take the inputs from frontend
      const { avatar, name, email, password } = req.body;

      //check whether user account exist
      const user = await Users.findOne({ email });

      //If user(email) found
      if (user) return res.status(400).json({ msg: "Email Already exists" });

      //length of password must be greater than 6
      if (password.length < 6)
        return res
          .status(401)
          .json({ msg: "password must be atleast of 6 characters" });

      //Hash the password using bcrypt npm package
      const passwordHash = bcrypt.hash(password, 10);

      //create new user
      const newUser = new Users({
        avatar,
        name,
        email,
        password: passwordHash,
      });

      await newUser.save();

      //Generate Access token and refresh tokens
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });
      //using refresh token create a cookie
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "",
      });

      //send back the response to the client
      res.json({ accesstoken });
    } catch (error) {
      res.status(500).json({ msg: "Error :" + error.message });
    }
  },
  login: async (req, res) => {},
  refreshtoken: async(req, res)=>{},
  logout: async(req, res)=>{},
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
