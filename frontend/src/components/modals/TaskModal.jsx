import FormModal from "./FormModal";
import { countWorkdays } from "../../utils/calc";
import { dateKeyFromToday } from "../../utils/calendar";
import { PRIORITIES, STATUSES, priorityOf, statusOf } from "../../utils/task";

/**
 * One modal for adding and editing a task.
 * - add:  pass `prefill` (the what-if "Assign" button uses it: memberId/totalHours/startDate/dueDate)
 * - edit: pass `task` (and `onDelete`); `members` should already be limited to the task's project
 * onSubmit(payload) -> error string or nothing, same as FormModal.
 */
export default function TaskModal({ task, members, projects, prefill = {}, onSubmit, onDelete, onClose, saving }) {
  const editing = Boolean(task);

  const handleSubmit = (v) => {
    const member = members.find((m) => m._id === v.memberId);
    const hours = parseFloat(v.totalHours);
    const actual = editing ? parseFloat(v.actualTime || "0") : 0;

    if (!member) return "Pick an assignee.";
    if (!v.title.trim()) return "Enter a task title.";
    if (!(hours > 0)) return "Estimated hours must be greater than 0.";
    if (!(actual >= 0)) return "Actual hours cannot be negative.";
    if (!v.startDate || !v.dueDate) return "Pick both a start and a due date.";
    if (v.dueDate < v.startDate) return "Due date cannot be before the start date.";
    if (!countWorkdays(v.startDate, v.dueDate)) return "That range has no working days (Mon-Fri).";

    const payload = {
      memberId: member._id,
      title: v.title.trim(),
      description: v.description.trim(),
      priority: v.priority,
      status: v.status,
      estTime: hours,
      startDate: v.startDate,
      dueDate: v.dueDate,
    };
    if (editing) payload.actualTime = actual;
    else payload.projectId = member.projectId; // derived from the member, so the two always match

    return onSubmit(payload);
  };

  const src = task ?? prefill;

  return (
    <FormModal
      title={editing ? "Edit task" : "Add task"}
      submitLabel={editing ? "Save changes" : "Add task"}
      savingLabel={editing ? "Saving…" : "Adding…"}
      onSubmit={handleSubmit}
      onDelete={editing ? onDelete : undefined}
      onClose={onClose}
      saving={saving}
      fields={[
        { name: "title", label: "Title", type: "text", defaultValue: src.title },
        { name: "description", label: "Description", type: "textarea", defaultValue: src.description ?? "", maxLength: 500 },
        {
          name: "memberId",
          label: "Assignee",
          type: "select",
          defaultValue: src.memberId,
          options: members.map((m) => ({
            value: m._id,
            label: `${m.name} (${projects.find((p) => p._id === m.projectId)?.name ?? "?"})`,
          })),
        },
        { name: "priority", label: "Priority", type: "select", half: true, defaultValue: task ? priorityOf(task) : "medium", options: PRIORITIES },
        { name: "status", label: "Status", type: "select", half: true, defaultValue: task ? statusOf(task) : "todo", options: STATUSES },
        {
          name: "totalHours",
          label: "Estimated hours",
          type: "number",
          half: editing,
          defaultValue: task ? task.estTime : prefill.totalHours,
          min: 0,
          step: 0.5,
        },
        ...(editing
          ? [{ name: "actualTime", label: "Actual hours", type: "number", half: true, defaultValue: task.actualTime ?? 0, min: 0, step: 0.5 }]
          : []),
        { name: "startDate", label: "Start date", type: "date", half: true, defaultValue: src.startDate || dateKeyFromToday(0) },
        { name: "dueDate", label: "Due date", type: "date", half: true, defaultValue: src.dueDate || dateKeyFromToday(4) },
      ]}
    />
  );
}
