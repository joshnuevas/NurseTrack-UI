const manualScheduleForm = document.querySelector("#manual-schedule-form");
const manualScheduleStatus = document.querySelector("#manual-schedule-status");
const manualScheduleMessage = document.querySelector("#manual-schedule-message");
const manualStudentSearch = document.querySelector("#manual-student-search");
const manualSectionFilter = document.querySelector("#manual-section-filter");
const manualStudentItems = Array.from(document.querySelectorAll("#manual-student-list .assign-student"));
const manualStudentChecks = Array.from(document.querySelectorAll("[data-manual-student-check]"));
const manualAddStudentsButton = document.querySelector("#manual-add-students");
const manualClearSelectionButton = document.querySelector("#manual-clear-selection");
const manualAssignedStudents = document.querySelector("#manual-assigned-students");
const manualStudentCount = document.querySelector("#manual-student-count");
const manualCaseTba = document.querySelector("#manual-case-tba");
const manualCaseInputs = Array.from(document.querySelectorAll("[data-manual-case-input]"));

const manualFields = {
  title: document.querySelector("#manual-title"),
  group: document.querySelector("#manual-group"),
  startDate: document.querySelector("#manual-start-date"),
  endDate: document.querySelector("#manual-end-date"),
  shiftStart: document.querySelector("#manual-shift-start"),
  shiftEnd: document.querySelector("#manual-shift-end")
};

const manualSummary = {
  date: document.querySelector("#manual-date-summary"),
  group: document.querySelector("#manual-group-summary"),
  students: document.querySelector("#manual-students-summary"),
  shift: document.querySelector("#manual-shift-summary")
};

let manualSelectedStudents = [];

function manualInitials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function setManualMessage(message, isSuccess = true) {
  if (!manualScheduleMessage) {
    return;
  }

  manualScheduleMessage.textContent = message;
  manualScheduleMessage.classList.toggle("is-success", isSuccess);
  manualScheduleMessage.classList.toggle("is-error", !isSuccess);
}

function setManualStatus(text, statusClass) {
  if (!manualScheduleStatus) {
    return;
  }

  manualScheduleStatus.textContent = text;
  manualScheduleStatus.className = `status-badge ${statusClass}`;
}

function formatManualDateRange() {
  const startDate = manualFields.startDate?.value || "";
  const endDate = manualFields.endDate?.value || "";

  if (!startDate && !endDate) {
    return "Not set";
  }

  if (startDate === endDate || !endDate) {
    return startDate;
  }

  if (!startDate) {
    return endDate;
  }

  return `${startDate} to ${endDate}`;
}

function syncManualSummary() {
  if (manualSummary.date) manualSummary.date.textContent = formatManualDateRange();
  if (manualSummary.group) manualSummary.group.textContent = manualFields.group?.value || "No group";
  if (manualSummary.students) manualSummary.students.textContent = `${manualSelectedStudents.length} assigned`;
  if (manualSummary.shift) {
    const shiftStart = manualFields.shiftStart?.value || "";
    const shiftEnd = manualFields.shiftEnd?.value || "";
    manualSummary.shift.textContent = shiftStart && shiftEnd ? `${shiftStart} to ${shiftEnd}` : "No shift";
  }
}

function syncManualCasePresentation() {
  const isTba = Boolean(manualCaseTba?.checked);

  manualCaseInputs.forEach((input) => {
    input.disabled = isTba;
    if (isTba) {
      input.value = "";
    }
  });
}

function renderManualAssignedStudents() {
  if (!manualAssignedStudents) {
    return;
  }

  manualAssignedStudents.classList.toggle("is-empty", manualSelectedStudents.length === 0);

  if (manualStudentCount) {
    manualStudentCount.textContent = `${manualSelectedStudents.length} student${manualSelectedStudents.length === 1 ? "" : "s"}`;
  }

  if (manualSelectedStudents.length === 0) {
    manualAssignedStudents.innerHTML = `
      <div class="manual-empty-roster-line" aria-hidden="true"></div>
    `;
    syncManualSummary();
    return;
  }

  manualAssignedStudents.innerHTML = `
    <div class="student-roster-table-row student-roster-table-head">
      <span>No.</span>
      <span>Student</span>
      <span>Group</span>
      <span>Action</span>
    </div>
    ${manualSelectedStudents.map((student, index) => `
      <div class="student-roster-table-row" data-manual-assigned-row>
        <span>${index + 1}.</span>
        <div class="roster-student-cell">
          <span class="avatar mini-avatar">${manualInitials(student)}</span>
          <strong>${student}</strong>
        </div>
        <span>${manualFields.group?.value || "No group"}</span>
        <div class="roster-action-buttons">
          <button class="ghost-button danger-action" type="button" data-remove-manual-student="${student}">Remove</button>
        </div>
      </div>
    `).join("")}
  `;

  manualAssignedStudents.querySelectorAll("[data-remove-manual-student]").forEach((button) => {
    button.addEventListener("click", () => {
      const student = button.dataset.removeManualStudent;
      manualSelectedStudents = manualSelectedStudents.filter((name) => name !== student);
      renderManualAssignedStudents();
      setManualStatus("Draft edited", "status-pending");
      setManualMessage(`${student} removed from the manual schedule.`);
    });
  });

  syncManualSummary();
}

function filterManualStudents() {
  const query = manualStudentSearch?.value.trim().toLowerCase() || "";
  const section = manualSectionFilter?.value || "BSN 3A";

  manualStudentItems.forEach((item) => {
    const matchesSearch = !query || item.dataset.student.toLowerCase().includes(query);
    const matchesSection = item.dataset.section === section;

    item.hidden = !matchesSearch || !matchesSection;
  });
}

function clearManualStudentSelection() {
  manualStudentChecks.forEach((check) => {
    check.checked = false;
  });
}

manualStudentSearch?.addEventListener("input", filterManualStudents);
manualSectionFilter?.addEventListener("change", filterManualStudents);
manualClearSelectionButton?.addEventListener("click", clearManualStudentSelection);

manualAddStudentsButton?.addEventListener("click", () => {
  const selectedChecks = manualStudentChecks.filter((check) => check.checked);
  const newStudents = selectedChecks.map((check) => check.value).filter((student) => !manualSelectedStudents.includes(student));

  if (newStudents.length === 0) {
    setManualMessage("Select at least one new student to add.", false);
    return;
  }

  manualSelectedStudents = [...manualSelectedStudents, ...newStudents];
  clearManualStudentSelection();
  renderManualAssignedStudents();
  setManualStatus("Draft edited", "status-pending");
  setManualMessage(`${newStudents.length} student${newStudents.length === 1 ? "" : "s"} added to the manual schedule.`);
});

Object.values(manualFields).forEach((field) => {
  field?.addEventListener("input", () => {
    syncManualSummary();
    renderManualAssignedStudents();
  });
  field?.addEventListener("change", () => {
    syncManualSummary();
    renderManualAssignedStudents();
  });
});

manualCaseTba?.addEventListener("change", syncManualCasePresentation);

manualScheduleForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (manualSelectedStudents.length === 0) {
    setManualMessage("Add at least one student before saving this manual schedule.", false);
    return;
  }

  setManualStatus("Saved draft", "status-verified");
  setManualMessage("Manual schedule saved as a draft. Publish it from Schedule Maker when ready.");
});

syncManualCasePresentation();
renderManualAssignedStudents();
syncManualSummary();
