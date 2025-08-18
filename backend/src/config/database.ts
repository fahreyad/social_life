import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined");
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
  
};

export default connectDB;
