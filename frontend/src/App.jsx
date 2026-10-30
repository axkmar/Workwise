import { useCallback, useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Grid from "./components/Grid";
import Popover from "./components/Popover";
import WhatIfPanel from "./components/WhatIfPanel";
import Toast from "./components/Toast";
import AddMemberModal from "./components/modals/AddMemberModal";
import AddProjectModal from "./components/modals/AddProjectModal";
import AddTaskModal from "./components/modals/AddTaskModal";

import { INITIAL_MEMBERS, INITIAL_PROJECTS, INITIAL_TASKS } from "./data/seed";
import { dateKeyFromToday } from "./utils/calendar";
import { evaluateWhatIf, tasksOnDay } from "./utils/calc";

export default function App() {
  // ---- data ----
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // ---- view state ----
  const [selectedProjectId, setSelectedProjectId] = useState(null); // null = all projects
  const [popover, setPopover] = useState(null); // { memberId, dateKey, anchor }
  const [modal, setModal] = useState(null); // { type: "member" | "project" | "task", prefill? }
  const [toast, setToast] = useState(null); // { id, text }

  // ---- what-if panel ----
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [whatIfForm, setWhatIfForm] = useState({ hours: "16", start: dateKeyFromToday(0), due: dateKeyFromToday(4) });
  const [hoverMemberId, setHoverMemberId] = useState(null);

  const whatIfOutcome = useMemo(
    () => evaluateWhatIf(members, tasks, whatIfForm),
    [members, tasks, whatIfForm]
  );

  // Hovering a candidate previews the extra load on the grid (derived, never stored)
  const preview = useMemo(() => {
    if (!whatIfOpen || !hoverMemberId || !whatIfOutcome.candidates) return null;
    return { memberId: hoverMemberId, extra: whatIfOutcome.extra, dayKeys: new Set(whatIfOutcome.dayKeys) };
  }, [whatIfOpen, hoverMemberId, whatIfOutcome]);

  const closeWhatIf = () => {
    setWhatIfOpen(false);
    setHoverMemberId(null);
  };

  // ---- helpers ----
  const showToast = (text) => setToast({ id: Date.now(), text });
  const clearToast = useCallback(() => setToast(null), []);
  const closeModal = () => setModal(null);
  const closePopover = useCallback(() => setPopover(null), []);

  const openTaskModal = (prefill = {}) => {
    if (!members.length || !projects.length) {
      showToast("Add a member and a project first");
      return;
    }
    setModal({ type: "task", prefill });
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const popoverMember = popover && members.find((m) => m.id === popover.memberId);

  return (
    <>
      <div className="app">
        <Sidebar
          projects={projects}
          tasks={tasks}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
          onAddProject={() => setModal({ type: "project" })}
        />

        <main className={`main${whatIfOpen ? " main--shifted" : ""}`}>
          <TopBar
            title={selectedProject ? selectedProject.name : "All projects"}
            onAddMember={() => setModal({ type: "member" })}
            onAddTask={() => openTaskModal()}
            onToggleWhatIf={() => (whatIfOpen ? closeWhatIf() : setWhatIfOpen(true))}
          />
          <div className="content">
            <Grid
              members={members}
              tasks={tasks}
              projectId={selectedProjectId}
              preview={preview}
              onCellClick={(memberId, dateKey, anchor) => setPopover({ memberId, dateKey, anchor })}
            />
          </div>
        </main>
      </div>

      <WhatIfPanel
        open={whatIfOpen}
        form={whatIfForm}
        onFormChange={(field, value) => setWhatIfForm((f) => ({ ...f, [field]: value }))}
        outcome={whatIfOutcome}
        onHoverMember={setHoverMemberId}
        onAssign={(memberId) =>
          openTaskModal({
            memberId,
            totalHours: parseFloat(whatIfForm.hours),
            startDate: whatIfForm.start,
            dueDate: whatIfForm.due,
          })
        }
        onClose={closeWhatIf}
      />

      {popover && popoverMember && (
        <Popover
          member={popoverMember}
          dateKey={popover.dateKey}
          tasks={tasksOnDay(tasks, popover.memberId, popover.dateKey, selectedProjectId)}
          projects={projects}
          anchor={popover.anchor}
          onClose={closePopover}
        />
      )}

      {modal?.type === "member" && (
        <AddMemberModal onAdd={(m) => setMembers((list) => [...list, m])} onClose={closeModal} />
      )}
      {modal?.type === "project" && (
        <AddProjectModal
          projectCount={projects.length}
          onAdd={(p) => setProjects((list) => [...list, p])}
          onClose={closeModal}
        />
      )}
      {modal?.type === "task" && (
        <AddTaskModal
          members={members}
          projects={projects}
          defaultProjectId={selectedProjectId || projects[0].id}
          prefill={modal.prefill}
          onAdd={(t) => setTasks((list) => [...list, t])}
          onClose={closeModal}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.text} onDone={clearToast} />}
    </>
  );
}
