import { useCallback, useEffect, useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Grid from "./components/Grid";
import Popover from "./components/Popover";
import WhatIfPanel from "./components/WhatIfPanel";
import Toast from "./components/Toast";
import AddMemberModal from "./components/modals/AddMemberModal";
import AddProjectModal from "./components/modals/AddProjectModal";
import AddTaskModal from "./components/modals/AddTaskModal";

import { dateKeyFromToday } from "./utils/calendar";
import { evaluateWhatIf, tasksOnDay } from "./utils/calc";

const API = "http://localhost:4000/api/v1";

export default function App({ token }) {
  // ---- data (always the full set for this user) ----
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // ---- view state ----
  const [selectedProjectId, setSelectedProjectId] = useState(null); // null = all projects
  const [popover, setPopover] = useState(null); // { memberId, dateKey, anchor }
  const [modal, setModal] = useState(null); // { type: "member" | "project" | "task", prefill? }
  const [toast, setToast] = useState(null); // { id, text }

  // ---- what-if panel ----
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [whatIfForm, setWhatIfForm] = useState({
    hours: "16",
    start: dateKeyFromToday(0),
    due: dateKeyFromToday(4),
  });
  const [hoverMemberId, setHoverMemberId] = useState(null);

  // Members shown in the grid / what-if / task modal: only the selected project's, or all
  const visibleMembers = useMemo(
    () =>
      selectedProjectId
        ? members.filter((m) => m.projectId === selectedProjectId)
        : members,
    [members, selectedProjectId]
  );

  const whatIfOutcome = useMemo(
    () => evaluateWhatIf(visibleMembers, tasks, whatIfForm),
    [visibleMembers, tasks, whatIfForm]
  );

  // ---- helpers ----
  const showToast = (text) => setToast({ id: Date.now(), text });
  const clearToast = useCallback(() => setToast(null), []);
  const closeModal = () => setModal(null);
  const closePopover = useCallback(() => setPopover(null), []);

  // ---- load data (once per login; project filtering happens on the client) ----
  useEffect(() => {
    if (!token) return;

    async function load() {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [p, m, t] = await Promise.all([
          fetch(`${API}/projects/`, { headers }),
          fetch(`${API}/members/`, { headers }),
          fetch(`${API}/tasks/`, { headers }),
        ]);

        if (!p.ok || !m.ok || !t.ok) throw new Error("Failed to load data");

        const [projectData, memberData, taskData] = await Promise.all([
          p.json(),
          m.json(),
          t.json(),
        ]);

        setProjects(projectData);
        setMembers(memberData);
        setTasks(taskData);
      } catch (err) {
        console.error(err);
        showToast(err.message);
      }
    }

    load();
  }, [token]);

  // ---- create ----
  // Returns an error string on failure (FormModal shows it), nothing on success.
  const handleAdd = async (payload, dest) => {
    try {
      const body =
        dest === "members"
          ? { ...payload, projectId: selectedProjectId }
          : payload;

      const res = await fetch(`${API}/${dest}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message || "Failed to create");

      if (dest === "projects") setProjects((list) => [...list, data]);
      else if (dest === "tasks") setTasks((list) => [...list, data]);
      else if (dest === "members") setMembers((list) => [...list, data]);

      closeModal();
    } catch (error) {
      console.error(error);
      return error.message;
    }
  };

  // Hovering a candidate previews the extra load on the grid (derived, never stored)
  const preview = useMemo(() => {
    if (!whatIfOpen || !hoverMemberId || !whatIfOutcome.candidates) return null;
    return {
      memberId: hoverMemberId,
      extra: whatIfOutcome.extra,
      dayKeys: new Set(whatIfOutcome.dayKeys),
    };
  }, [whatIfOpen, hoverMemberId, whatIfOutcome]);

  const closeWhatIf = () => {
    setWhatIfOpen(false);
    setHoverMemberId(null);
  };

  const openMemberModal = () => {
    if (!selectedProjectId) {
      showToast("Select a project first");
      return;
    }
    setModal({ type: "member" });
  };

  const openTaskModal = (prefill = {}) => {
    if (!visibleMembers.length || !projects.length) {
      showToast("Add a member and a project first");
      return;
    }
    setModal({ type: "task", prefill });
  };

  const selectedProject = projects.find((p) => p._id === selectedProjectId);
  const popoverMember = popover && members.find((m) => m._id === popover.memberId);

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
            onAddMember={openMemberModal}
            onAddTask={() => openTaskModal()}
            onToggleWhatIf={() => (whatIfOpen ? closeWhatIf() : setWhatIfOpen(true))}
          />
          <div className="content">
            <Grid
              members={visibleMembers}
              tasks={tasks}
              projectId={selectedProjectId}
              preview={preview}
              onCellClick={(memberId, dateKey, anchor) =>
                setPopover({ memberId, dateKey, anchor })
              }
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
        <AddMemberModal
          onAdd={(m) => handleAdd(m, "members")}
          onClose={closeModal}
          projectId={selectedProjectId}
        />
      )}
      {modal?.type === "project" && (
        <AddProjectModal
          projectCount={projects.length}
          onAdd={(p) => handleAdd(p, "projects")}
          onClose={closeModal}
        />
      )}
      {modal?.type === "task" && (
        <AddTaskModal
          members={visibleMembers}
          projects={projects}
          prefill={modal.prefill}
          onAdd={(t) => handleAdd(t, "tasks")}
          onClose={closeModal}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.text} onDone={clearToast} />}
    </>
  );
}