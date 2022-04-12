import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
