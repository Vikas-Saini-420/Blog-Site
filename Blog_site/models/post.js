//jshint esversion :8
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    category : {
        type : String ,
        required : true
    },
    title : {
    type : String ,
    required : true,
    trim : true,
},
user :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
},
displayName : {
    type : String ,
    default : 'user',
    required : true
},
img: 
{  
    type: String 
} ,
createdAt :{
    type : String ,
    default : (new Date()).toLocaleDateString('hi-IN')
},
comments : {
    type : [ {} ]
},
content :{
    type : String ,
    required : true
}

});

module.exports = mongoose.model('Post' , PostSchema); 