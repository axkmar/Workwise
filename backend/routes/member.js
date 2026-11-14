const express = require('express');
const zod = require('zod');
const { Project, Member } = require('../database/db');
const Auth = require('../auth.js');
const Router = express.Router();

const addMemberSchema = zod.object({
  projectId: zod.string(),
  name: zod.string().min(1),
  hoursPerDay: zod.number().positive(),
});

// CREATE
Router.post('/', Auth, async (req, res) => {
  const parsed = addMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { projectId, name, hoursPerDay } = parsed.data;

  const project = await Project.findOne({ _id: projectId, managerId: req.user.userId });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const member = await Member.create({ projectId, name, hoursPerDay });
  return res.status(201).json(member); // frontend appends this directly
});

// READ: GET /members or GET /members?projectId=abc
Router.get('/', Auth, async (req, res) => {
  const { projectId } = req.query;

  if (projectId) {
    const project = await Project.findOne({ _id: projectId, managerId: req.user.userId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const members = await Member.find({ projectId });
    return res.json(members);
  }

  // no projectId = all members across this user's projects
  const projects = await Project.find({ managerId: req.user.userId }).select('_id');
  const members = await Member.find({
    projectId: { $in: projects.map((p) => p._id) },
  });
  return res.json(members);
});

// DELETE: DELETE /members/:id
Router.delete('/:id', Auth, async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ message: "Member not found" });

  const project = await Project.findOne({ _id: member.projectId, managerId: req.userId });
  if (!project) return res.status(403).json({ message: "Not allowed" });

  await member.deleteOne();
  return res.json({ message: "Member deleted" });
});

module.exports = Router;