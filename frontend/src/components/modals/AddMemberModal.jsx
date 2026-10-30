import FormModal from "./FormModal";
import { makeId } from "../../utils/dates";

export default function AddMemberModal({ onAdd, onClose }) {
  const handleSubmit = (v) => {
    const hours = parseFloat(v.hours);
    if (!v.name.trim()) return "Enter a name.";
    if (!(hours > 0 && hours <= 24)) return "Hours per day must be between 0 and 24.";
    onAdd({ id: makeId("m"), name: v.name.trim(), dailyAvailableHours: hours });
  };

  return (
    <FormModal
      title="Add member"
      submitLabel="Add"
      onSubmit={handleSubmit}
      onClose={onClose}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "hours", label: "Available hours per day", type: "number", defaultValue: 8, min: 1, max: 24, step: 0.5 },
      ]}
    />
  );
}
