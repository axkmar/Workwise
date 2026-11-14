const express = require('express');
const zod = require('zod');
const { Project, Member, Task } = require('../database/db');
const Auth = require('../auth.js');
const Router = express.Router();

const addTaskSchema = zod.object({
  projectId: zod.string(),
  memberId: zod.string(),
  title: zod.string().min(1),
  estTime: zod.number().positive(),
  startDate: zod.string(),
  dueDate: zod.string(),
});

// CREATE
Router.post('/', Auth, async (req, res) => {
  const parsed = addTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const data = parsed.data;

  const project = await Project.findOne({ _id: data.projectId, managerId: req.user.userId });
  if (!project) return res.status(404).json({ message: "Project not found" });

  const member = await Member.findOne({ _id: data.memberId, projectId: data.projectId });
  if (!member) return res.status(404).json({ message: "Member not found in this project" });

  const task = await Task.create(data);
  return res.status(201).json(task);
});

// READ: GET /tasks or GET /tasks?projectId=abc
Router.get('/', Auth, async (req, res) => {
  const { projectId } = req.query;

  if (projectId) {
    const project = await Project.findOne({ _id: projectId, managerId: req.user.userId });
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.json(await Task.find({ projectId }));
  }

  const projects = await Project.find({ managerId: req.user.userId }).select('_id');
  const tasks = await Task.find({
    projectId: { $in: projects.map((p) => p._id) },
  });
  return res.json(tasks);
});

// DELETE: DELETE /tasks/:id
Router.delete('/:id', Auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findOne({ _id: task.projectId, managerId: req.user.userId });
  if (!project) return res.status(403).json({ message: "Not allowed" });

  await task.deleteOne();
  return res.json({ message: "Task deleted" });
});

module.exports = Router;