//jshint esversion :8
const googleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport){
passport.use(new googleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : '/auth/google/compose'
}, async(accessToken , refreshToken , profile , done)=>{
    const newUser ={
        googleId : profile.id,
        displayName : profile.displayName,
        image : profile.photos[0].value ,
    }
    try{
        let user = await User.findOne({googleId:profile.id})
        if(user){
            done(null , user);
        }
        else {
            user = await User.create(newUser);
            done(null, user);
        }
    }catch(err){
        console.error(err);
    }

} ) );
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}