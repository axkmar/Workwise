import { useState } from "react";
import Button from "../Button";
import Field from "../Field";
import Spinner from "../Spinner";

/**
 * Generic form dialog (bottom sheet on phones, centred dialog from sm up).
 * fields: [{ name, label, type, defaultValue, options, min, max, step, half }]  (half = share a row with the next field)
 * onSubmit(values) -> return an error string to keep the dialog open, or nothing to close it.
 * onDelete (optional) -> adds a Delete button (asks to click twice); same return rule as onSubmit.
 */
export default function FormModal({ title, fields, submitLabel, savingLabel = "Adding…", onSubmit, onDelete, onClose, saving }) {
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false); // two-step delete, no window.confirm

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = await onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
    if (err) setError(err);
    else onClose();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return setConfirmDelete(true);
    const err = await onDelete();
    if (err) {
      setError(err);
      setConfirmDelete(false);
    } else onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-[2px] sm:items-center sm:p-4"
      onPointerDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex max-h-[92dvh] w-full animate-pop-in flex-col gap-4 overflow-y-auto overscroll-contain rounded-t-2xl border border-b-0 border-line bg-card
          p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black/60 motion-reduce:animate-none
          sm:max-w-md sm:rounded-2xl sm:border-b sm:pb-5"
      >
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          {fields.map(({ name, half, ...rest }, i) => (
            <Field key={name} name={name} autoFocus={i === 0} className={half ? "col-span-1" : "col-span-2"} {...rest} />
          ))}
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-over/40 bg-over/10 px-3 py-2 text-sm text-over-ink">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
          {onDelete && (
            <Button
              onClick={handleDelete}
              disabled={saving}
              className={`col-span-2 sm:mr-auto ${confirmDelete ? "border-over/60 bg-over/15 text-over-ink" : "text-over-ink"}`}
            >
              {confirmDelete ? "Click again to confirm" : "Delete"}
            </Button>
          )}
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving && <Spinner className="size-4 border-current/30 border-t-current" />}
            {saving ? savingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
