const express = require('express');
const zod = require('zod')
const {User} = require('../database/db.js')
const Auth = require('../auth.js')
const Router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY

const SigninUpSchema = zod.object({
  email:zod.string(),
  password:zod.string()
})

Router.get('/',Auth,async(req,res)=>{ //get profile data
  const user = await User.findById(req.userId).select("-password");
  return res.json(user);
})

Router.post('/signup',async(req,res)=>{ //create profile
  const {success} = SigninUpSchema.safeParse(req.body);

  if(!success){
    return res.status(400).json({
      message:"Invalid Credentials"
    })
  }

  const existingUser = await User.findOne({
    email:req.body.email
  })

  if(existingUser){
    return res.status(409).json({ message: "Email already registered" })
  }

  const user = await User.create({
    email:req.body.email,
    password:req.body.password
  })

  const userId = user._id;

  const token = jwt.sign({
    userId
  },JWT_KEY,{
    expiresIn:'7d'
  });

  return res.status(200).json({
    message:"User Created Successfully!",
    token:token
  })
})

Router.post('/signin',async(req,res)=>{ //create profile
  const {success} = SigninUpSchema.safeParse(req.body);

  if(!success){
    return res.status(400).json({
      message:"Invalid Credentials"
    })
  }

  const user = await User.findOne({ email:req.body.email,password:req.body.password });

  if (!user) {
    return res.status(400).json({ 
      message: "Invalid email or password" 
    });
  }

  const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: '7d' });

  return res.status(200).json({
    message:"Signed in Successfully!",
    token:token
  })
})

// Router.put('/',async(req,res)=>{ //Update profile

// })

Router.delete('/',Auth,async(req,res)=>{ //delete profile
  await User.deleteOne({_id:req.userId})

  res.json({
    message:"Account Deleted Successfully!"
  })
})

module.exports = Router;