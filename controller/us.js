import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../module/user.js";

export const initGitHubPassport = () => {
  passport.use(new GitHubStrategy({
      clientID: 'Ov23liYJ6bnCNSHNDMwI',
      clientSecret: '9272684a7a9698dcc97caf82b61fea6c5cf34db2',
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {


      try {
        const githubEmail = profile.emails ? profile.emails[0].value : "noemail@github.com";
        console.log("🔹 GitHub Email:", githubEmail);

        // Check if user exists by email
        let user = await User.findOne({ email: githubEmail });

        if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
            
          }
          return done(null, user);
        }

        // If user not exists, create new
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          email: githubEmail,
          avatar_url: profile.photos ? profile.photos[0].value : "",
        });

      
        return done(null, user);
      } catch (err) {
        console.error(" GitHub Strategy Error:", err);
        return done(err, null);
      }
    }
  ));

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
