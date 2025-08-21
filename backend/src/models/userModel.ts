import mongoose from "mongoose";
import validator from 'validator';
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  photo: string;
  bio: string;
  skills: string[];
  password: string;
  jwtSign(): string;
  passwordMatch(password: string): Promise<boolean>;
}
const userSchema = new mongoose.Schema(
    {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, validate: {
        validator: function(value: string) {
            return validator.isEmail(value);
        },
        message: "Invalid email format"
    }},
    age: { type: Number, default: 18, trim: true },
    gender: { type: String, required: true , lowercase: true, validate:function(value:string) {
        const validGenders = ["male", "female", "other"];
        if(!validGenders.includes(value)) {
            throw new Error("Invalid gender only accept male, female, other" );
        }
    } },
    photo: { type: String, default: "https://www.istockphoto.com/photos/default-image", validate: {
        validator: function(value: string) {
            return validator.isURL(value);
        },
        message: "Invalid photo URL format"
    }},
    bio: { type: String, default: "" },
    skills: {
        type: [String],
        default: [],
        validate: {
            validator: function(value: string[]) {
                return value.length <= 10 && value.every(v => typeof v === "string");
            },
            message: "Skills can contain a maximum of 10 strings"
        },
        set: function(value: any[]) {
            if (!Array.isArray(value)) return [];
            // Only keep string values
            return value.filter(v => typeof v === "string");
        }
    },
    password: { type: String, required: true },
},{timestamps: true});

userSchema.methods.jwtSign = async function(): Promise<string> {
    const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    if(!token){
        console.error("Error generating JWT token");
        throw new Error("Internal server error");
    }
    console.log("JWT token generated successfully: " + token);
    return token;
};
userSchema.methods.passwordMatch = async function(passwordFromInput:string): Promise<boolean> {
    const isMatch = await bcrypt.compare(passwordFromInput, this.password);
    return isMatch;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
