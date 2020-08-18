//jshint esversion:8

const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env' });
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore  = require('connect-mongo')(session);
const router = express.Router();
const {ensureAuth  , ensureGuest} = require('./middleware/auth');
const {ObjectId} = require('mongodb');
const fs = require('fs'); 
const path = require('path'); 
const multer = require('multer');
const postModel = require('./models/post');

//Passport config

require('./config/passport')(passport);

//Load config for mongodb
const connectDB = require('./config/db');
const { Mongoose } = require('mongoose');

//call the method
connectDB();


//create the storage directory
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
      cb(null, 'uploads') ;
  }, 
  filename: (req, file, cb) => { 
      cb(null, file.fieldname + '-' + Date.now()) ;
  } 
}); 
const upload = multer({ storage: storage }); 
//storage directory

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
if(process.env.NODE_ENV ==='development'){
  app.use(morgan('dev'));
}


// express session middleware
app.use(session({
  secret: 'my little secret',
  resave: false,
  saveUninitialized: false,
  store : new MongoStore({mongooseConnection:mongoose.connection})
}));

//set the template engine
app.set('view engine', 'ejs');
app.use(express.static("public"));




//Passport Middleware

app.use(passport.initialize());
app.use(passport.session());



//for storing images

 
//
app.post('/upload',ensureAuth , (req, res, next) => { 
  const obj = { 
      title: req.body.title, 
      displayName : req.user.displayName,
      content : req.body.description,
      category : req.body.categ,
      createdAt : (new Date()).toLocaleDateString('hi-IN'),

      img:   req.body.postImage, 
      user :req.user._id
  }; 
   postModel.create(obj, (err, item) => { 
      if (err) { 
  //        console.log(err); 
          res.render('error/500');
      } 
      else { 
          // item.save(); 
          res.redirect('/'); 
      } 
  }); 
}); 
app.get('/'  , async(req , res)=>{ 
  try{
  const posts = await  postModel.find({})
  .sort({createdAt:-1})
  .populate()
  .lean();
  res.render('home' ,{posts : posts});
  }catch(err)
  {
//
    res.render('error/500');
  }
});
app.get('/posts/:category'  , async(req , res)=>{ 
//  console.log(req.params.category);
  try{
  const posts = await  postModel.find({category : req.params.category})
  .sort({createdAt:-1})
  .populate()
  .lean();
  res.render('home' ,{posts : posts});
  }catch(err)
  {
 //   console.error(err);
    res.render('error/500');
  }
});

app.get('/getParticular/:id'  , async(req , res)=>{ 
  try{
  const post = await  postModel.findOne({_id :req.params.id})
  .populate()
  .lean();
 // console.log(post);
  //console.log(post.comments);
  res.render('post' ,{post : post , comments : post.comments});
  }catch(err)
  {
 //   console.error(err);
    res.render('error/500');
  }
});
app.get('/getbyUser/:id'  , async(req , res)=>{ 
  try{
  const posts = await  postModel.find({user :req.params.id})
  .sort({createdAt:-1})
  .populate()
  .lean();
//  console.log(posts);
  //console.log(post.comments);
  res.render('home' ,{posts : posts});
  }catch(err)
  {
 //   console.error(err);
    res.render('error/500');
  }
});

app.get('/getParticular/:id/delete', ensureAuth  , async(req , res)=>{ 
  try{
  const post = await  postModel.findOne({_id :req.params.id}).populate().lean();
  let pu = post.user.toString();
  let ui = (req.user._id).toString();

  try{
    if( (pu) === (ui))
  {
    await postModel.remove({_id : req.params.id});
    res.redirect('/');
  }}catch(err)
  {
 //   console.error(err);
  }

  }catch(err)
  {
    //console.error(err);
    res.render('error/500');
  }
});

app.post('/getParticular/:id/comment', ensureAuth  , async(req , res)=>{ 
  try{
  const post = await  postModel.findOne({_id :req.params.id}).populate().lean();

  const ob = ({
    name : req.user.displayName,
    comment : req.body.postComment
  });
  let comments = post.comments;
  comments.push(ob);
  await postModel.findByIdAndUpdate( {_id : req.params.id} , {$set  : {comments : comments}});
 // console.log(" i was here");
  res.redirect('/getParticular/'+req.params.id);
  }catch(err)
  {
//    console.error(err);
    res.render('error/500');
  }
});

app.get("/myposts" , ensureAuth , async(req , res)=>{
  try{
    const posts = await  postModel.find({user :req.user.id}).populate().lean();
   // console.log(posts);
    //console.log(post.comments);
    res.render('home' ,{posts : posts});
    }catch(err)
    {
      //console.error(err);
      res.render('error/500');
    }
}
);

   // authenticate with google
   app.get('/auth/google' , passport.authenticate('google' , {scope : ['profile'] } ) );
 
   //
 app.get('/auth/google/compose' , passport.authenticate('google', { failureRedirect : '/auth/google'}),(req  , res) =>{
     res.redirect('/compose');
 });
app.get('/compose' ,ensureAuth , (req , res) =>{
  res.render('compose');
});
 app.get('/auth/logout' , (req , res)=>{
   req.logout();
   res.redirect('/');
 });
const PORT = process.env.PORT || 3000 ;
app.listen(PORT , ()=>{
});