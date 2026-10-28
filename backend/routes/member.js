const express = require('express');
const zod = require('zod')
const { User,Project, Member } = require('../database/db');
const Router = express.Router();

const addMemberSchema = zod.object({
  projectId:zod.string(),
  hoursPerDay:zod.number(),
  name:zod.string()
})

Router.post('/',async(req,res)=>{  // add project to currentUser
  const {success} = addMemberSchema.safeParse(req.body);

  if(!success){
    return res.json({message:"Invalid Credentials"});
  }

  const projectId = req.body.projectId;
  const existingProject = await Project.findOne({
    _id:projectId
  })

  if(!existingProject)
    return res.json({message:"User Not Found"});

  await Member.create({
    projectId:projectId,
    hoursPerDay:req.body.hoursPerDay,
    name:req.body.name
  })
  
  return res.status(200).json({
    message:"Project Created Succesfully"
  })
})

Router.get('/',async(req,res)=>{  // get project data
  const member = await Member.find({
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

Router.delete('/',async(req,res)=>{ //delete project data
  await Member.deleteOne({
    projectId:req.body.projectId
  })

  return res.json({message:"Project Succesfully Deleted"})
})

module.exports = Router;