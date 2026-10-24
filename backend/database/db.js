const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/workwise')

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
    minLength:10,
    maxLength:30
  }
})

const projectSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  name:{
    type:String,
    required:true,
    maxLength:30
  }
})

const memberSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  role:{
    type:String,
    required:true
  },
  hoursPerDay:{
    type:Number,
    required:true
  },
  name:{
    type:String,
    required:true
  }
})

const TaskSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  title:{
    type:String,
    required:true
  },
  estTime:{
    type:Number,
    required:true
  },
  project:{
    type:String,
    required:true
  },
  member:{
    type:String,
    required:true
  }
})