import express, { Request, Response } from "express";
import userAuth from "../middlewares/userAuth.js";
import User from "../models/userModel.js";

const router = express.Router();



router.get("/connections", userAuth, async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json("get all user connections request");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});


router.get("/requests", userAuth, async (req: Request, res: Response) => {
  // const { recipientId } = req.body;
  try {
    // Logic to send a connection request
    res.status(200).json({ message: "get Request List from other users" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
//get user profiles 
router.get("/feed", userAuth, async (req: Request, res: Response) => {
  // const { recipientId } = req.body;
  try {
    // Logic to send a connection request
    res.status(200).json({ message: "All profiles of user" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;
