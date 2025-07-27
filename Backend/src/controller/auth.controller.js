import cloudinary from "../lib/cloudnary.js";
import { generateToken } from "../lib/util.js";
import User from "../modules/user.module.js";
import bcrypt from "bcryptjs";
import Message from "../modules/message.module.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
         await newUser.save();
      // generate jwt token here
      generateToken(newUser._id, res);
     
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
    const {email, password, fullName} = req.body;
    try {
      if(!email || !password){
       return res.status(400).json({message:"Email and Password are required"});
  }
       const user = await User.findOne({email});
      if(!user) return res.status(400).json({message:"User not found"});
      const isPasswordvalid = await bcrypt.compare(password, user.password);
      if(!isPasswordvalid){
        return res.status(400).json({message:"Invalid Password"});
      }

      // generate jwt token here
      generateToken(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      })  
    } catch (error) {
      console.log("error in log in controller", error);
      res.status(500).json({message: "Internal Servar Error"})
    }
}

export const logout = (req, res) => {
    try {
      res.cookie("token", "", {maxAge: 0});
      res.status(200).json({message: "Logged Out Successfully"});
    } catch (error) {
      console.log("Error in the LogOut controller", error);
      res.status(500).json({message: "Internal Server Error"});   
    }
}

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body;
    const userId =req.user._id;
    if(!profilePic){
      return res.status(400).json({message: "profile Picture is required"});
    }
    const uplodeResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId,
      {profilePic: uplodeResponse.secure_url},
      {new: true}
    );
    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("error in update profile controller", error);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in the check Auth controller", error );
    res.status(500).json({message: "Internal server Error"});
  }
}


export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Delete all messages (sent or received)
    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // 2. Delete the user
    await User.findByIdAndDelete(userId);

    // 3. Clear the cookie
    res.clearCookie("token");

    // ✅ Send success response
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAccount:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
