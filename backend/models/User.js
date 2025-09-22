import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion: {
    type: String,
    required: true,
    enum: {
      values: ["favoriteColor", "favoriteGame"],
      message: "Please select valid Security question",
    },
  },
  securityAnswer: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
