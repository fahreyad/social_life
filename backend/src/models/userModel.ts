import mongoose from "mongoose";
import validator from 'validator';
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

const User = mongoose.model("User", userSchema);

export default User;
