const express = require('express');
const zod = require('zod')
const {User} = require('../database/db.js')
const Router = express.Router();

const SigninUpSchema = zod.object({
  email:zod.string(),
  password:zod.string()
})

Router.get('/',(req,res)=>{ //get profile data
  const user = User.findById(req.userId).select("-password");
  return res.json(user);
})

Router.post('/',async(req,res)=>{ //create profile
  const {success} = SigninUpSchema.safeParse(req.body);

  if(!success){
    return res.status(401).json({
      message:"Invalid Credentials"
    })
  }

  const existingUser = await User.findOne({
    email:req.body.email
  })

  if(existingUser){
    return res.json({ message:"Existed User"})
  }

  const user = await User.create({
    email:req.body.email,
    password:req.body.password
  })

  // const userId = user._id;

  // const token = jwt.sign({
  //   userId
  // },12123);

  return res.status(200).json({
    message:"User Created Successfully!"
  })
})

// Router.put('/',async(req,res)=>{ //Update profile

// })

Router.delete('/',async(req,res)=>{ //delete profile
  await User.deleteOne({_id:req.userId})

  res.json({
    message:"Account Deleted Successfully!"
  })
})

module.exports = Router;