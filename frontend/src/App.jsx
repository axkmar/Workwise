import { useCallback, useEffect, useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Grid from "./components/Grid";
import Legend from "./components/Legend";
import Spinner from "./components/Spinner";
import Popover from "./components/Popover";
import WhatIfPanel from "./components/WhatIfPanel";
import Toast from "./components/Toast";
import AddMemberModal from "./components/modals/AddMemberModal";
import AddProjectModal from "./components/modals/AddProjectModal";
import AddTaskModal from "./components/modals/AddTaskModal";

import { dateKeyFromToday } from "./utils/calendar";
import { evaluateWhatIf, tasksOnDay } from "./utils/calc";

const API = `${import.meta.env.VITE_API_URL}/api/v1`;
const NOUN = { members: "Member", projects: "Project", tasks: "Task" };

export default function App({ token }) {
  // ---- data (always the full set for this user) ----
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // first data load
  const [saving, setSaving] = useState(false); // a create request is in flight

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
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  // ---- create ----
  // Returns an error string on failure (FormModal shows it), nothing on success.
  const handleAdd = async (payload, dest) => {
    if (saving) return; // blocks double-submit
    setSaving(true);
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
      if (!res.ok) throw new Error(data.message || "Failed to create");

      if (dest === "projects") setProjects((list) => [...list, data]);
      else if (dest === "tasks") setTasks((list) => [...list, data]);
      else if (dest === "members") setMembers((list) => [...list, data]);

      closeModal();
      showToast(`${NOUN[dest]} added`);
    } catch (error) {
      console.error(error);
      return error.message;
    } finally {
      setSaving(false);
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
      {/* phones & iPads: sidebar is a strip on top. lg+: sidebar on the left. Safe-area padding keeps clear of notch / home bar. */}
      <div
        className="flex h-dvh min-w-0 flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] lg:flex-row"
      >
        <Sidebar
          projects={projects}
          tasks={tasks}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
          onAddProject={() => setModal({ type: "project" })}
        />

        <main
          className={`flex min-h-0 min-w-0 flex-1 flex-col transition-[padding] duration-200 motion-reduce:transition-none ${
            whatIfOpen ? "max-sm:pb-[55dvh] xl:pr-[22rem]" : ""
          }`}
        >
          <TopBar
            title={selectedProject ? selectedProject.name : "All projects"}
            onAddMember={openMemberModal}
            onAddTask={() => openTaskModal()}
            onToggleWhatIf={() => (whatIfOpen ? closeWhatIf() : setWhatIfOpen(true))}
          />
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-3 pb-6 sm:px-6">
            {loading ? (
              <div role="status" className="flex items-center justify-center gap-3 py-24 text-muted">
                <Spinner />
                Loading…
              </div>
            ) : (
              <>
                <Grid
                  members={visibleMembers}
                  tasks={tasks}
                  projectId={selectedProjectId}
                  preview={preview}
                  onCellClick={(memberId, dateKey, anchor) =>
                    setPopover({ memberId, dateKey, anchor })
                  }
                />
                <Legend className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 lg:hidden" />
              </>
            )}
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
          saving={saving}
        />
      )}
      {modal?.type === "project" && (
        <AddProjectModal
          projectCount={projects.length}
          onAdd={(p) => handleAdd(p, "projects")}
          onClose={closeModal}
          saving={saving}
        />
      )}
      {modal?.type === "task" && (
        <AddTaskModal
          members={visibleMembers}
          projects={projects}
          prefill={modal.prefill}
          onAdd={(t) => handleAdd(t, "tasks")}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.text} onDone={clearToast} />}
    </>
  );
}
