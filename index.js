import express from 'express';
import p1 from './router/r1.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import ejs from 'ejs';
import path from 'path';


const app = express();
const PORT = 3000;

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'view')); // folder name check

// Body parser
app.use(express.json());

app.use("/api",p1);
// Session
app.use(session({
  secret: 'abc123',
  resave: false,
  saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub strategy
passport.use(new GitHubStrategy({
    clientID: 'Iv23lifkg4xGYgcn3ztF',
    clientSecret: 'b73e8b64587d6da8834e8caefb585f4dc6d56293',    
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {      
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
app.get('/', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/auth/github');
  }
  res.render('profile', { user: req.user });
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
      res.send('<h1>Login Successful</h1><a href="/">Go to Profile</a>');
    }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });   
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
