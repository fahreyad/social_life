import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { userValidationSchema } from "../utils/userValidation.js";
import { loginValidationSchema } from "../utils/loginValidation.js";
const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  // Validate request body
  const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // Format error messages to be more API-friendly
    const messages = error.details.map(detail => {
      // Remove quotes and make message more readable
      return detail.message.replace(/"/g, "").replace(/ is required$/, " is required field");
    });
    return res.status(400).json({ errors: messages });
  }

  // Check for existing user
  const existingUser = await User.findOne({ email: value.email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value.password, salt);
  value.password = hashedPassword;

  // Save new user
  const newUser = new User(value);
  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err: unknown) {
    res.status(500).json({ error: "An unknown error occurred" });
  }
});
router.post("/login", async (req: Request, res: Response) => {
  // Validate request body
  const { error, value } = loginValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // Format error messages to be more API-friendly
    const messages = error.details.map(detail => {
      // Remove quotes and make message more readable
      return detail.message.replace(/"/g, "").replace(/ is required$/, " is required field");
    });
    return res.status(400).json({ errors: messages });
  }

  // Check for existing user
  const existingUser = await User.findOne({ email: value.email });
  if (!existingUser) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Check password
  const isMatch = await existingUser.passwordMatch(value.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Generate and return JWT token
  const token = await existingUser.jwtSign();
  res.cookie("token", token, { httpOnly: true, path: "/", expires: new Date(Date.now() + 86400000) });
  res.status(200).json({ message: "Login successful" });
});
export default router;
