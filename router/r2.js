import express from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { initGitHubPassport } from "../controller/us.js";

initGitHubPassport(); // Ensure passport strategy is initialized


const router = express.Router();

router.get("/home", (req, res) => {
  res.render("home");
});

// GitHub login
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);


// GitHub callback
router.get(
  "/github/callback",

  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
      console.log("GitHub callback hit!");
    res.render("profile");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
