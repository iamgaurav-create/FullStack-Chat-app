import User from "../modules/user.module.js";
import Message from "../modules/message.module.js"
import cloudinary from "../lib/cloudnary.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in getUserForSliderbar", error.message);
        res.status(500).json({error: "Internal Server Error"});        
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
           $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId},
           ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages); // ✅ Use the correct variable here
    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { text, image } =req.body;
        const { id: receiverId } =req.params;
        const senderId =req.user._id;

        let imageUrl;
        if(image) {
            //uplode to cloudinary
            const uplodeResponse = await cloudinary.uploader.upload(image);
            imageUrl =uplodeResponse.secure_url;
        }

        const newMessage = new Message ({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        //to do un the real time 

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in Sending Messgaes Controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}