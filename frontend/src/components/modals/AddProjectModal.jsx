import FormModal from "./FormModal";
import { PROJECT_COLOURS } from "../../data/seed";

export default function AddProjectModal({ projectCount, onAdd, onClose, saving }) {
  const handleSubmit = (v) => {
    if (!v.name.trim()) return "Enter a project name.";
    return onAdd({ name: v.name.trim(), color: v.colour });
  };

  return (
    <FormModal
      title="Add project"
      submitLabel="Add"
      onSubmit={handleSubmit}
      onClose={onClose}
      fields={[
        { name: "name", label: "Project name", type: "text" },
        {
          name: "colour",
          label: "Colour",
          type: "color",
          defaultValue: PROJECT_COLOURS[projectCount % PROJECT_COLOURS.length],
        },
      ]}
      saving={saving}
    />
  );
}
