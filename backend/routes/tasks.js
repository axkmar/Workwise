const express = require('express');
const zod = require('zod')
const { User,Project, Member, Task } = require('../database/db');
const Auth = require('../auth.js')
const Router = express.Router();
const JWT_KEY = process.env.JWT_KEY

const addTaskSchema = zod.object({
  projectId:zod.string(),
  title:zod.string(),
  estTime:zod.number(),
  member:zod.string()
})

Router.post('/',Auth,async(req,res)=>{  // add project to currentUser
  const {success} = addTaskSchema.safeParse(req.body);

  if(!success){
    return res.json({message:"Invalid Credentials"});
  }

  const projectId = req.body.projectId;
  const existingProject = await Project.findOne({
    _id:projectId
  })

  if(!existingProject)
    return res.json({message:"Project Not Found"});

  await Task.create({
    projectId:projectId,
    title:req.body.title,
    estTime:req.body.hoursPerDay,
    memberId:req.body.memberId
  })
  
  return res.status(200).json({
    message:"Task Created Succesfully"
  })
})

Router.get('/',Auth,async(req,res)=>{  // get project data
  const member = await Task.find({
    projectId:req.body.projectId
  });
  return res.json(member);
})

// Router.put('/',async(req,res)=>{  // update project
//   const project = await Project.find({
//     managerId:req.body.managerId
//   });
//   return res.json(project);
// })

Router.delete('/',Auth,async(req,res)=>{ //delete project data
  await Task.deleteOne({
    projectId:req.body.projectId
  })

  return res.json({message:"Project Succesfully Deleted"})
})

module.exports = Router;