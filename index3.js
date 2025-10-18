import express from "express";
import mongoose from "mongoose";
import User from "./module/user.js";
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import ejs from 'ejs';
import path from 'path';

const app = express();
const PORT = 3000;
mongoose.connect("mongodb://127.0.0.1:27017/Github", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Error:", err));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'view'));
// Body parser

app.use(session({
  secret: 'abc123',
  resave: false,
  saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());



passport.use(new GitHubStrategy({
    clientID: 'Ov23liYJ6bnCNSHNDMwI',
    clientSecret: '9272684a7a9698dcc97caf82b61fea6c5cf34db2',    
    callbackURL: "http://localhost:3000/auth/github/callback",
        scope: ['user:email']  
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Check if user exists
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        // If not, create new user
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails ? profile.emails[0].value : "",
          avatar_url: profile.photos ? profile.photos[0].value : "",
        });
        console.log("✅ New User Created:", user);
      } else {
        console.log("ℹ️ User Already Exists:", user);
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.get('/', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/auth/github');
  }
  res.render('profile', { user: req.user });
});
app.get('/auth/github', passport.authenticate('github'));

// GitHub callback
app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/'); // profile page
    }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});