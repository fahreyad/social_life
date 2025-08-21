import express, { Application, Request, Response,NextFunction } from "express";
import dotenv from "dotenv";
import auth from "./middlewares/auth.js"; // Importing the auth middleware
import userAuth from "./middlewares/userAuth.js";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRouter.js";
import userRoute from "./routes/userRouter.js";
import profileRouter from "./routes/profileRouter.js";
import connectionRouter from "./routes/connectionRouter.js";

dotenv.config();
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());

//route
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/profile', profileRouter);
app.use('/request', connectionRouter);
app.use('/admin', auth);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/about", userAuth, (req: Request, res: Response) => {
  res.send("about")
})

app.get("/contact", userAuth, (req: Request, res: Response) => {
  res.send("contact")
})

app.use("/", (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


// Connect to MongoDB and start server
connectDB().then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

