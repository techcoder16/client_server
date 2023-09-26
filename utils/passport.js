
require('dotenv').config()
const User  = require("../models/User");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/auth/callback",
        scope:['openid','profile', 'email'],


},
async function(request, accessToken, refreshToken, profile, done) {

    try {
     
  
        let user = await User.findOne({ token: profile.id });
    
        if (user) {
          return done(null, user, { message: 'User already exists' });
        } else {
    
        
          user = new User({
            token: profile.id,
            username: profile.displayName,
            email:profile.emails[0].value,

            password:profile.password,
         
          });
          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    return done(null, profile);

}
));

passport.serializeUser(function(user, done) {
done(null, user);
});

passport.deserializeUser(function(user, done) {
done(null, user);
});