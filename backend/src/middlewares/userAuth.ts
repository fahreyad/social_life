import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/userModel.js";

const userAuth = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
        if (!decoded || !decoded._id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }        
        req.user = user;
        next(); // Call next middleware or route handler
    } catch (error) {
        console.error("Error in userAuth middleware:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export default userAuth;