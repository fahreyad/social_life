import express, { Request, Response } from "express";
import userAuth from "../middlewares/userAuth.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/view", userAuth, async (req: Request, res: Response) => {
  
  try {
    res.status(200).json(req.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});


// router.delete("/:id", userAuth, async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "An unknown error occurred" });
//     }
//   }
// });

router.patch("/edit", userAuth, async (req: Request, res: Response) => {
  try {
    const allowedUpdates = ["gender", "age", "photo", "bio", "skills"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates only accept gender, age, photo, bio, skills" });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: user not found in request" });
    }
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.patch("/password", userAuth, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: user not found in request" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // const isMatch = await user.comparePassword(currentPassword);
    // if (!isMatch) {
    //   return res.status(400).json({ error: "Current password is incorrect" });
    // }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});


export default router;
