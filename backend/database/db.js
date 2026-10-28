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
  managerId:{
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
  projectId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
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

const taskSchema = new mongoose.Schema({
  projectId:{
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
  memberId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false
  }
})

const User = mongoose.model("User", userSchema);
const Member = mongoose.model("Member", memberSchema);
const Project = mongoose.model("Project",projectSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = {
  User,Member,Project,Task
}