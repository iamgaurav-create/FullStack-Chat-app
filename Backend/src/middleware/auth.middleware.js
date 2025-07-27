import jwt from "jsonwebtoken";
import User from "../modules/user.module.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;  

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
        
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Not authorized, token expired" });
        }
        
        res.status(500).json({ message: "Internal Server Error" });
    }
};
