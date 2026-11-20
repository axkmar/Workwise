const express = require('express');
const zod = require('zod');
const { Project, Member, Task, PRIORITIES, STATUSES } = require('../database/db');
const Auth = require('../auth.js');
const Router = express.Router();

const dateKey = zod.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const addTaskSchema = zod.object({
  projectId: zod.string(),
  memberId: zod.string(),
  title: zod.string().min(1),
  description: zod.string().max(500).optional(),
  priority: zod.enum(PRIORITIES).optional(),
  status: zod.enum(STATUSES).optional(),
  estTime: zod.number().positive(),
  startDate: dateKey,
  dueDate: dateKey,
});

// every field optional: send only what changed. projectId can't be changed.
const updateTaskSchema = zod.object({
  memberId: zod.string().optional(),
  title: zod.string().min(1).optional(),
  description: zod.string().max(500).optional(),
  priority: zod.enum(PRIORITIES).optional(),
  status: zod.enum(STATUSES).optional(),
  estTime: zod.number().positive().optional(),
  actualTime: zod.number().min(0).optional(),
  startDate: dateKey.optional(),
  dueDate: dateKey.optional(),
});

// CREATE
Router.post('/', Auth, async (req, res) => {
  const parsed = addTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const data = parsed.data;

  if (data.dueDate < data.startDate) {
    return res.status(400).json({ message: "Due date cannot be before the start date" });
  }

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

// UPDATE: PUT /tasks/:id  (edit, reassign, reschedule, change status/priority, log actual hours)
Router.put('/:id', Auth, async (req, res) => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const data = parsed.data;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const project = await Project.findOne({ _id: task.projectId, managerId: req.user.userId });
  if (!project) return res.status(403).json({ message: "Not allowed" });

  // reassigning: the new member must belong to the same project as the task
  if (data.memberId) {
    const member = await Member.findOne({ _id: data.memberId, projectId: task.projectId });
    if (!member) return res.status(404).json({ message: "Member not found in this project" });
  }

  const start = data.startDate ?? task.startDate;
  const due = data.dueDate ?? task.dueDate;
  if (due < start) {
    return res.status(400).json({ message: "Due date cannot be before the start date" });
  }

  task.set(data);
  await task.save();
  return res.json(task);
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
