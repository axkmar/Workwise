import FormModal from "./FormModal";
import { countWorkdays } from "../../utils/calc";
import { dateKeyFromToday } from "../../utils/calendar";
import { makeId } from "../../utils/dates";

/** `prefill` can pre-set title/projectId/memberId/totalHours/startDate/dueDate (used by the what-if "Assign" button). */
export default function AddTaskModal({ members, projects, defaultProjectId, prefill = {}, onAdd, onClose }) {
  const handleSubmit = (v) => {
    const hours = parseFloat(v.totalHours);
    if (!v.title.trim()) return "Enter a task title.";
    if (!(hours > 0)) return "Total hours must be greater than 0.";
    if (!v.startDate || !v.dueDate) return "Pick both a start and a due date.";
    if (v.dueDate < v.startDate) return "Due date cannot be before the start date.";
    if (!countWorkdays(v.startDate, v.dueDate)) return "That range has no working days (Mon-Fri).";
    onAdd({
      id: makeId("t"),
      title: v.title.trim(),
      projectId: v.projectId,
      memberId: v.memberId,
      totalHours: hours,
      startDate: v.startDate,
      dueDate: v.dueDate,
    });
  };

  return (
    <FormModal
      title="Add task"
      submitLabel="Add task"
      onSubmit={handleSubmit}
      onClose={onClose}
      fields={[
        { name: "title", label: "Title", type: "text", defaultValue: prefill.title },
        {
          name: "projectId", label: "Project", type: "select",
          defaultValue: prefill.projectId || defaultProjectId,
          options: projects.map((p) => ({ value: p.id, label: p.name })),
        },
        {
          name: "memberId", label: "Assignee", type: "select",
          defaultValue: prefill.memberId,
          options: members.map((m) => ({ value: m.id, label: m.name })),
        },
        { name: "totalHours", label: "Total hours", type: "number", defaultValue: prefill.totalHours, min: 0, step: 0.5 },
        { name: "startDate", label: "Start date", type: "date", defaultValue: prefill.startDate || dateKeyFromToday(0) },
        { name: "dueDate", label: "Due date", type: "date", defaultValue: prefill.dueDate || dateKeyFromToday(4) },
      ]}
    />
  );
}
