import express, { Application, Request, Response,NextFunction } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import auth from "./middlewares/auth.js"; // Importing the auth middleware
import userAuth from "./middlewares/userAuth.js";
import connectDB from "./config/database.js";
import User from "./models/userModel.js";
import { userValidationSchema } from "./utils/userValidation.js";
import { loginValidationSchema } from "./utils/loginValidation.js";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

dotenv.config();
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());


// Routes
app.post("/signup", userAuth, async (req: Request, res: Response) => {
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

app.post("/login", userAuth, async (req: Request, res: Response) => {
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
  const isMatch = await bcrypt.compare(value.password, existingUser.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Generate and return JWT token
  const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true, path: "/" });
  res.status(200).json({ message: "Login successful" });
});

app.get("/profile", userAuth, async (req: Request, res: Response) => {
  const { token } = req.cookies; // Assuming userId is set by the userAuth middleware
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const {_id} = decoded;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

app.get("/feed", userAuth, async (req: Request, res: Response) => {
  // Feed retrieval logic here
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

app.post("/user", userAuth, async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});


app.get("/user", userAuth, async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
app.delete("/user/:id", userAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

app.patch("/user/:id", userAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const allowedUpdates = ["gender", "age", "photo", "bio", "skills"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates only accept gender, age, photo, bio, skills" });
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
app.use('/admin', auth); // Using the auth middleware


app.get("/", (req: Request, res: Response) => {
  
  res.send("Hello World!");
});



app.get("/about", userAuth, (req: Request, res: Response) => {
  res.send("about")
})
app.get("/contact", userAuth, (req: Request, res: Response) => {
  
  res.send("contact")
})

app.get("/admin/getData", (req: Request, res: Response) => {
  res.send("admin data")
})
app.use("/", (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } 
})



connectDB().then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

