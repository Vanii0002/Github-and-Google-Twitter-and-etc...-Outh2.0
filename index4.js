import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import r1 from "./router/r2.js";      
import { initGitHubPassport } from "./controller/us.js"; // Passport setup

dotenv.config();

const app = express();
const PORT = 3000;

// -------------------- MongoDB --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/Github", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Error:", err));

// -------------------- EJS --------------------
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "view"));

// -------------------- Middleware --------------------
app.use(express.json());
app.use(
  session({
    secret: "abc123",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// -------------------- Passport --------------------
initGitHubPassport();       // Initialize GitHub strategy
app.use(passport.initialize());
app.use(passport.session());

// -------------------- Routes --------------------
app.use("/auth", r1); // All GitHub auth routes (login, callback, logout)

// -------------------- Server --------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
