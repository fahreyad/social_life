import { Request, Response, NextFunction } from "express";
const userAuth = (req: Request, res: Response, next: NextFunction) => {
    // Authentication logic here
    console.log("User Auth middleware triggered");
    next(); // Call next middleware or route handler
}
export default userAuth;