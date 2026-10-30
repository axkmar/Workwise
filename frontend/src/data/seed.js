// Demo data. Shapes map 1:1 to future MongoDB collections.
import { dateKeyFromToday as day } from "../utils/calendar";

export const PROJECT_COLOURS = ["#5b8def", "#a78bfa", "#f59e6b", "#4cc9a6", "#f472b6", "#e2b93b"];

export const INITIAL_MEMBERS = [
  { id: "m1", name: "Aarav Sharma", dailyAvailableHours: 8 },
  { id: "m2", name: "Meera Iyer", dailyAvailableHours: 8 },
  { id: "m3", name: "Kabir Singh", dailyAvailableHours: 6 },
  { id: "m4", name: "Sana Khan", dailyAvailableHours: 8 },
  { id: "m5", name: "Rohan Verma", dailyAvailableHours: 8 },
];

export const INITIAL_PROJECTS = [
  { id: "p1", name: "Website Revamp", colour: "#5b8def" },
  { id: "p2", name: "Mobile App", colour: "#a78bfa" },
  { id: "p3", name: "Data Migration", colour: "#f59e6b" },
];

export const INITIAL_TASKS = [
  { id: "t1", title: "Homepage redesign", projectId: "p1", memberId: "m1", totalHours: 50, startDate: day(0), dueDate: day(6) },
  { id: "t2", title: "Design system tokens", projectId: "p2", memberId: "m1", totalHours: 16, startDate: day(3), dueDate: day(9) },
  { id: "t3", title: "Checkout API", projectId: "p2", memberId: "m2", totalHours: 30, startDate: day(0), dueDate: day(6) },
  { id: "t4", title: "Push notifications", projectId: "p2", memberId: "m2", totalHours: 20, startDate: day(7), dueDate: day(13) },
  { id: "t5", title: "Schema mapping", projectId: "p3", memberId: "m3", totalHours: 24, startDate: day(0), dueDate: day(6) },
  { id: "t6", title: "Legacy data cleanup", projectId: "p3", memberId: "m3", totalHours: 12, startDate: day(4), dueDate: day(10) },
  { id: "t7", title: "SEO audit", projectId: "p1", memberId: "m4", totalHours: 20, startDate: day(1), dueDate: day(7) },
  { id: "t8", title: "QA regression pass", projectId: "p1", memberId: "m5", totalHours: 16, startDate: day(0), dueDate: day(13) },
];
