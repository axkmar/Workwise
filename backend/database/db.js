const MONGO_URL = process.env.MONGO_URL

const mongoose = require('mongoose');
mongoose.connect(MONGO_URL)

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
  },
  color:{
    type:String,
    default:"FFFFFF"
  }
})

const memberSchema = new mongoose.Schema({
  projectId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project",
    required:true
  },
  name:{
    type:String,
    required:true
  },
  hoursPerDay:{
    type:Number,
    required:true
  },
})

const PRIORITIES = ["low", "medium", "high", "critical"];
const STATUSES = ["todo", "in_progress", "in_review", "completed"];

const taskSchema = new mongoose.Schema({
  projectId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project",
    required:true
  },
  memberId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Member",
    required:false
  },
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    default:"",
    maxLength:500
  },
  priority:{
    type:String,
    enum:PRIORITIES,
    default:"medium"
  },
  status:{
    type:String,
    enum:STATUSES,
    default:"todo"
  },
  estTime:{            // estimated hours (drives planned workload)
    type:Number,
    required:true
  },
  actualTime:{         // actual hours logged (display only, never used in capacity maths)
    type:Number,
    default:0,
    min:0
  },
  startDate:{ 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: String, 
    required: true 
  },
})

const User = mongoose.model("User", userSchema);
const Member = mongoose.model("Member", memberSchema);
const Project = mongoose.model("Project",projectSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = {
  User,Member,Project,Task,PRIORITIES,STATUSES
}