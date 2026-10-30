import FormModal from "./FormModal";
import { PROJECT_COLOURS } from "../../data/seed";
import { makeId } from "../../utils/dates";

export default function AddProjectModal({ projectCount, onAdd, onClose }) {
  const handleSubmit = (v) => {
    if (!v.name.trim()) return "Enter a project name.";
    onAdd({ id: makeId("p"), name: v.name.trim(), colour: v.colour });
  };

  return (
    <FormModal
      title="Add project"
      submitLabel="Add"
      onSubmit={handleSubmit}
      onClose={onClose}
      fields={[
        { name: "name", label: "Project name", type: "text" },
        { name: "colour", label: "Colour", type: "color", defaultValue: PROJECT_COLOURS[projectCount % PROJECT_COLOURS.length] },
      ]}
    />
  );
}
