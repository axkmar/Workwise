const express = require('express');
const zod = require('zod')
const { User,Project } = require('../database/db');
const Router = express.Router();

const addProjectSchema = zod.object({
  managerId:zod.string(),
  name:zod.string()
})

Router.post('/',async(req,res)=>{  // add project to currentUser
  const {success} = addProjectSchema.safeParse(req.body);

  if(!success){
    return res.json({message:"Invalid Credentials"});
  }

  const managerId = req.body.managerId;
  const existingUser = await User.findOne({
    _id:managerId
  })

  if(!existingUser)
    return res.json({message:"User Not Found"});

  Project.create({
    managerId:managerId,
    name:req.body.name
  })
  
  return res.status(200).json({
    message:"Project Created Succesfully"
  })
})

Router.get('/',async(req,res)=>{  // get project data
  const project = await Project.find({
    managerId:req.body.managerId
  });
  return res.json(project);
})

// Router.put('/',async(req,res)=>{  // update project
//   const project = await Project.find({
//     managerId:req.body.managerId
//   });
//   return res.json(project);
// })

Router.delete('/',async(req,res)=>{ //delete project data
  await Project.deleteOne({
    managerId:req.body.managerId
  })

  return res.json({message:"Project Succesfully Deleted"})
})

module.exports = Router;