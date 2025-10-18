import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // OAuth IDs
  githubId: { type: String, default: null },
  googleId: { type: String, default: null },

  // Basic info
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // email unique rakhenge taaki duplicate na bane
  avatar_url: { type: String, default: "" },

  // Optional traditional login
  password: { type: String, default: "" }, // OAuth ke liye blank rahega
}, { timestamps: true }); // automatically createdAt & updatedAt add karega

const User = mongoose.model("User", userSchema);

export default User;
