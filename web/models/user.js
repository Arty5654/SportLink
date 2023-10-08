import { Schema, model, models } from "mongoose";

const UserSchema = newSchema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required"],
  },
  pasword: {
    type: String,
    required: [true, "You must select a password"],
  },
});
