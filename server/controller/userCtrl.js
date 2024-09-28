const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users.models");

const userCtrl = {
  register: async (req, res) => {
    try {
      //take the inputs from frontend
      const { avatar, username, email, password } = req.body;

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
      const passwordHash = await bcrypt.hash(password, 10);

      //create new user
      const newUser = new Users({
        avatar,
        username,
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
        path: "/user/refresh_token",
      });

      //send back the response to the client
      res.json({ accesstoken });
    } catch (error) {
      res.status(500).json({ msg: "Error :" + error.message });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Users.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "User not found, please Register first" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ msg: "Invalid Password, Please try again!" });

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: "Error" + error.message });
    }
  },
  refreshtoken: async (req, res) => {
    try {
      const rf_token = req.cookie.refreshtoken;

      if (!rf_token)
        return res.status(404).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Invalid refresh token" });
        const accesstoken = createAccessToken({ id: user._id });
        res.json({ accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ msg: "Error: "+error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path:"/user/refresh_token" });
      return res.json({ msg:"Logout successful" })
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async(req, res)=>{
    try {
      const user = await Users.findById(req.user.id).select("-password");

      if(!user) return res.status(404).json({ msg:"User Not Found" });
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: "Error: "+error.message });
    }
  }
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
