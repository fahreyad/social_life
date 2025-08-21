import express, { Request, Response } from "express";
import userAuth from "../middlewares/userAuth.js";


const router = express.Router();

router.post("/send/interested/:id", userAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Logic to send a connection request
    res.status(200).json({ message: "Connection request sent" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});


router.post("/send/ignored/:id", userAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Logic to send a connection request
    res.status(200).json({ message: "Connection request sent" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.post("/send/accepted/:requestId", userAuth, async (req: Request, res: Response) => {
  const { requestId } = req.params;
  try {
    // Logic to send a connection request
    res.status(200).json({ message: "Connection request sent" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.post("/send/rejected/:requestId", userAuth, async (req: Request, res: Response) => {
  const { requestId } = req.params;
  try {
    // Logic to send a connection request
    res.status(200).json({ message: "Connection request sent" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
export default router;
