const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const filterButtons = Array.from(document.querySelectorAll("[data-record-filter]"));
const recordItems = Array.from(document.querySelectorAll("#student-record-list .submission-item"));
const recordMessage = document.querySelector("#record-message");
const assignedInstructor = document.querySelector(".sidebar-account strong")?.textContent.trim() || "Prof. Reyes";

const students = {
  "maria-cruz": {
    name: "Maria Cruz",
    initials: "MC",
    id: "12-3456-789",
    section: "BSN 3A",
    site: "Cebu City Medical Center",
    area: "Ward B",
    assignedCi: "Prof. Reyes",
    status: "In progress",
    duty: 67,
    cases: 58,
    procedures: 65,
    pending: 14
  },
  "licheal-ursulo": {
    name: "Lichael Ursulo",
    initials: "LU",
    id: "23-1788-402",
    section: "BSN 3A",
    site: "Cebu City Medical Center",
    area: "Delivery Room",
    assignedCi: "Prof. Reyes",
    status: "Completed",
    duty: 100,
    cases: 100,
    procedures: 96,
    pending: 0
  },
  "treasure-abadinas": {
    name: "Treasure Abadinas",
    initials: "TA",
    id: "22-1845-103",
    section: "BSN 3A",
    site: "Vicente Sotto Medical Center",
    area: "Delivery Room",
    assignedCi: "Prof. Reyes",
    status: "On track",
    duty: 74,
    cases: 70,
    procedures: 72,
    pending: 6
  },
  "jay-tiongzon": {
    name: "Jay Tiongzon",
    initials: "JT",
    id: "23-1782-221",
    section: "BSN 3B",
    site: "Community Health Center",
    area: "Health Teaching",
    assignedCi: "Prof. Reyes",
    status: "Needs action",
    duty: 50,
    cases: 42,
    procedures: 48,
    pending: 18
  },
  "andrea-gomez": {
    name: "Andrea Gomez",
    initials: "AG",
    id: "20-4408-332",
    section: "BSN 4A",
    site: "Skills Laboratory",
    area: "Simulation Duty",
    assignedCi: "Prof. Reyes",
    status: "In progress",
    duty: 82,
    cases: 66,
    procedures: 76,
    pending: 9
  }
};

function statusClass(status) {
  if (status === "Completed" || status === "On track") {
    return "status-verified";
  }

  if (status === "Needs action") {
    return "status-rejected";
  }

  return "status-pending";
}

function showAccessDenied() {
  const main = document.querySelector("main.workspace");

  if (!main) {
    return;
  }

  main.innerHTML = `
    <section class="workspace-hero dashboard-hero">
      <div>
        <p class="section-kicker">Assigned Student Access</p>
        <h2>This student is not assigned to ${assignedInstructor}.</h2>
        <p>Clinical Instructors can view progress only for students in their assigned schedule scope.</p>
      </div>
      <a class="primary-button workspace-action button-link" href="instructor-student-view.html">Back to assigned students</a>
    </section>
  `;
}

function setText(id, text) {
  document.querySelector(`#${id}`).textContent = text;
}

function setTrack(id, value) {
  document.querySelector(`#${id}`).style.width = `${value}%`;
}

function applyStudent(student) {
  const dutyAccepted = Math.round((72 * student.duty) / 100);
  const caseApproved = Math.round((24 * student.cases) / 100);
  const procedureComplete = Math.round((48 * student.procedures) / 100);

  setText("progress-avatar", student.initials);
  setText("progress-name", student.name);
  setText("progress-meta", `${student.section} - Student ID ${student.id} - ${student.site} rotation`);

  const statusBadge = document.querySelector("#progress-status");
  statusBadge.textContent = student.status;
  statusBadge.className = `status-badge ${statusClass(student.status)}`;

  setText("duty-summary", `${dutyAccepted} of 72 hours accepted`);
  setTrack("duty-track", student.duty);
  setText("duty-value", `${student.duty}%`);

  setText("case-summary", `${caseApproved} of 24 case logs approved`);
  setTrack("case-track", student.cases);
  setText("case-value", `${student.cases}%`);

  setText("procedure-summary", `${procedureComplete} of 48 checklist items completed`);
  setTrack("procedure-track", student.procedures);
  setText("procedure-value", `${student.procedures}%`);

  setText("pending-value", student.pending);
  setText("duty-breakdown", `${dutyAccepted} verified - ${Math.max(0, 72 - dutyAccepted)} remaining duty hours`);
  setTrack("duty-breakdown-track", student.duty);
  setText("case-breakdown", `${caseApproved} approved - ${Math.max(0, 24 - caseApproved)} remaining case logs`);
  setTrack("case-breakdown-track", student.cases);
  setText("procedure-breakdown", `${procedureComplete} completed - ${Math.max(0, 48 - procedureComplete)} remaining checklist items`);
  setTrack("procedure-breakdown-track", student.procedures);

  setText("profile-section", student.section);
  setText("profile-student-id", student.id);
  setText("profile-site", student.site);
  setText("profile-area", student.area);
  setText("follow-up-count", `${student.pending} open`);
}

function filterRecords(filter) {
  let visibleCount = 0;

  recordItems.forEach((item) => {
    const isVisible = filter === "all" || item.dataset.status === filter;
    item.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  const label = filter === "all" ? "recent" : filter;
  recordMessage.textContent = `Showing ${visibleCount} ${label} record${visibleCount === 1 ? "" : "s"}.`;
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    filterRecords(button.dataset.recordFilter);
  });
});

const params = new URLSearchParams(window.location.search);
const studentKey = params.get("student") || "maria-cruz";
const selectedStudent = students[studentKey];

if (!selectedStudent || selectedStudent.assignedCi !== assignedInstructor) {
  showAccessDenied();
} else {
  applyStudent(selectedStudent);
}
