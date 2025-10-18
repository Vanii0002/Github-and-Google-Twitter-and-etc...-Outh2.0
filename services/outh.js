import { GitHub } from "arctic";
import dotenv from "dotenv";
dotenv.config();

export const github = new GitHub({
  clientId:"Iv23lifkg4xGYgcn3ztF",
  clientSecret: "b73e8b64587d6da8834e8caefb585f4dc6d56293",
  redirectURI: "http://localhost:3000/api/auth/github/callback",
});
