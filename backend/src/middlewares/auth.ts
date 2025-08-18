import { Request, Response, NextFunction } from "express";
const auth = (req: Request, res: Response, next: NextFunction) => {
    // Authentication logic here
    console.log("Auth middleware triggered");
    next(); // Call next middleware or route handler
}
export default auth;