import FormModal from "./FormModal";
import { PROJECT_COLOURS } from "../../data/seed";

export default function AddProjectModal({ projectCount, onAdd, onClose }) {
  const handleSubmit = (v) => {
    if (!v.name.trim()) return "Enter a project name.";
    onAdd({ id: v._id, name: v.name.trim(), colour: v.colour });
  };

  return (
    <FormModal
      title="Add project"
      submitLabel="Adds"
      onSubmit={handleSubmit}
      onClose={onClose}
      fields={[
        { name: "name", label: "Project name", type: "text" },
        { name: "colour", label: "Colour", type: "color", defaultValue: PROJECT_COLOURS[projectCount % PROJECT_COLOURS.length] },
      ]}
    />
  );
}
