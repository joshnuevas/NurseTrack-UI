const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const appealForm = document.querySelector("#student-appeal-form");
const appealMessage = document.querySelector("#student-appeal-message");
let appealList = document.querySelector("#student-appeal-list");
let appealListCount = document.querySelector("#student-appeal-list-count");
const submittedCount = document.querySelector("#student-appeal-submitted-count");
const recommendedCount = document.querySelector("#student-appeal-recommended-count");
const approvedCount = document.querySelector("#student-appeal-approved-count");
const syncPill = document.querySelector("#student-appeal-sync");
const heroStatus = document.querySelector("#student-appeal-hero-status");
const appealFilesInput = document.querySelector("#appeal-files");
const appealFileSummary = document.querySelector("#appeal-file-summary");

const typeLabels = {
  attendance: "Attendance",
  schedule: "Schedule",
  case: "Clinical case"
};

const studentAppealRecords = {
  pending: {
    title: "Late arrival due to bus delay",
    type: "Attendance",
    dutyDate: "April 29, 2026",
    site: "CCMC",
    area: "Emergency Room",
    submitted: "today, 7:48 AM",
    assignedCi: "Patricia Reyes, RN, MAN",
    status: "Pending",
    badgeClass: "status-pending",
    reason: "CIT-U shuttle was delayed after traffic rerouting near the hospital entrance.",
    evidence: "Transport advisory and timestamped arrival photo were attached.",
    files: ["transport-advisory.pdf", "arrival-photo.jpg"]
  },
  accepted: {
    title: "Excused tardiness request",
    type: "Attendance",
    dutyDate: "April 12, 2026",
    site: "CCMC",
    area: "Emergency Room",
    submitted: "April 12, 2026, 8:04 AM",
    assignedCi: "Patricia Reyes, RN, MAN",
    status: "Accepted",
    badgeClass: "status-verified",
    reason: "Student submitted a transport delay notice before the duty shift ended.",
    evidence: "CI verified the timestamped notice and accepted the appeal.",
    files: ["delay-notice.pdf"]
  }
};

function setMessage(text, state) {
  if (!appealMessage) {
    return;
  }

  appealMessage.textContent = text;
  appealMessage.classList.remove("is-error", "is-success");

  if (state) {
    appealMessage.classList.add(state);
  }
}

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  const [year, month, day] = value.split("-");
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[Number(month) - 1] || month} ${Number(day)}, ${year}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateSummary() {
  const cards = Array.from(document.querySelectorAll(".student-appeal-history-item"));
  const submitted = cards.filter((card) => card.dataset.status === "submitted" || card.dataset.status === "pending").length;
  const recommended = cards.filter((card) => card.dataset.status === "recommended").length;
  const approved = cards.filter((card) => card.dataset.status === "accepted" || card.dataset.status === "approved").length;
  const open = submitted + recommended;

  if (appealListCount) {
    appealListCount.textContent = `${cards.length} record${cards.length === 1 ? "" : "s"}`;
  }

  const pendingCount = document.querySelector("#student-appeal-pending-count");
  const acceptedCount = document.querySelector("#student-appeal-accepted-count");

  if (pendingCount) {
    pendingCount.textContent = `${submitted} record${submitted === 1 ? "" : "s"}`;
  }

  if (acceptedCount) {
    acceptedCount.textContent = `${approved} record${approved === 1 ? "" : "s"}`;
  }

  if (submittedCount) {
    submittedCount.textContent = `${submitted} appeal${submitted === 1 ? "" : "s"} submitted`;
  }

  if (recommendedCount) {
    recommendedCount.textContent = `${recommended} appeal${recommended === 1 ? "" : "s"} recommended`;
  }

  if (approvedCount) {
    approvedCount.textContent = `${approved} appeal${approved === 1 ? "" : "s"} approved`;
  }

  if (syncPill) {
    syncPill.textContent = `${open} open`;
  }

  if (heroStatus) {
    heroStatus.textContent = open > 0 ? "Awaiting CI review" : "No open appeals";
    heroStatus.className = `status-badge ${open > 0 ? "status-pending" : "status-verified"}`;
  }
}

function buildAppealCard(formData) {
  const type = formData.get("appealType");
  const title = escapeHtml(String(formData.get("title") || "").trim());
  const site = escapeHtml(String(formData.get("site") || "").trim());
  const area = escapeHtml(String(formData.get("area") || "").trim());
  const relatedDate = formatDate(String(formData.get("dutyDate") || ""));
  const fileCount = appealFilesInput?.files?.length || 0;

  return `
    <a class="student-appeal-history-item" href="student-appeals.html?appeal=pending" data-status="submitted">
      <span class="avatar small-avatar">MC</span>
      <span class="student-appeal-history-copy">
        <strong>${title}</strong>
        <small>${typeLabels[type] || "Appeal"} - ${relatedDate} - ${site}</small>
        <small>Submitted just now${fileCount ? ` - ${fileCount} file${fileCount === 1 ? "" : "s"} attached` : ""}</small>
      </span>
      <span class="status-badge status-pending">Pending</span>
    </a>
  `;
}

function updateAppealFileSummary() {
  if (!appealFileSummary || !appealFilesInput) {
    return;
  }

  const files = Array.from(appealFilesInput.files || []);
  appealFileSummary.textContent = files.length
    ? files.map((file) => file.name).join(", ")
    : "No files selected";
}

function renderStudentAppealDetail() {
  const selectedAppeal = new URLSearchParams(window.location.search).get("appeal");
  const record = studentAppealRecords[selectedAppeal];
  const main = document.querySelector("main.workspace");

  if (!record || !main) {
    return false;
  }

  main.innerHTML = `
    <section class="workspace-panel student-appeal-history-panel">
      <div class="panel-heading">
        <div>
          <p class="section-kicker">BSN 3A - 12-3456-789</p>
          <h2>Maria Cruz's Appeal History</h2>
        </div>
      </div>

      <article class="student-appeal-detail-card">
        <div class="student-appeal-detail-head">
          <div>
            <h3>${escapeHtml(record.title)}</h3>
            <div class="student-appeal-detail-meta">
              <span>Submitted ${escapeHtml(record.submitted)}</span>
              <span>Assigned CI: ${escapeHtml(record.assignedCi)}</span>
            </div>
          </div>
          <span class="status-badge ${record.badgeClass}">${record.status}</span>
        </div>

        <div class="appeal-fact-grid">
          <div>
            <span>Appeal Type</span>
            <strong>${escapeHtml(record.type)}</strong>
          </div>
          <div>
            <span>Related Duty Date</span>
            <strong>${escapeHtml(record.dutyDate)}</strong>
          </div>
          <div>
            <span>Clinical Site</span>
            <strong>${escapeHtml(record.site)}</strong>
          </div>
          <div>
            <span>Duty Area</span>
            <strong>${escapeHtml(record.area)}</strong>
          </div>
        </div>

        <div class="appeal-detail-grid">
          <div class="appeal-detail-note">
            <p class="section-kicker">Student Reason</p>
            <p>${escapeHtml(record.reason)}</p>
          </div>
          <div class="appeal-detail-note">
            <p class="section-kicker">Supporting Evidence or Notes</p>
            <p>${escapeHtml(record.evidence)}</p>
          </div>
          <div class="appeal-detail-note">
            <p class="section-kicker">Supporting Files</p>
            <p>${record.files.map(escapeHtml).join(", ")}</p>
          </div>
        </div>
      </article>
    </section>
  `;

  return true;
}

function renderInitialAppealHistory() {
  const panel = document.querySelector(".student-appeal-summary-panel");

  if (!panel) {
    return;
  }

  panel.classList.add("student-appeal-history-panel");
  panel.innerHTML = `
    <div class="panel-heading">
      <div>
        <h2>Maria Cruz's Appeal History</h2>
      </div>
      <span class="status-badge status-verified" id="student-appeal-list-count">2 records</span>
    </div>

    <div class="student-appeal-history-section">
      <div class="student-appeal-history-title">
        <span>Pending</span>
        <span id="student-appeal-pending-count">1 record</span>
      </div>

      <div class="student-appeal-history-list" id="student-appeal-list" aria-live="polite">
        <a class="student-appeal-history-item" href="student-appeals.html?appeal=pending" data-status="submitted">
          <span class="avatar small-avatar">MC</span>
          <span class="student-appeal-history-copy">
            <strong>Late arrival due to bus delay</strong>
            <small>Attendance - April 29, 2026 - CCMC</small>
            <small>Submitted today, 7:48 AM - 2 files attached</small>
          </span>
          <span class="status-badge status-pending">Pending</span>
        </a>
      </div>
    </div>

    <div class="student-appeal-history-section">
      <div class="student-appeal-history-title">
        <span>Accepted</span>
        <span id="student-appeal-accepted-count">1 record</span>
      </div>

      <div class="student-appeal-history-list">
        <a class="student-appeal-history-item" href="student-appeals.html?appeal=accepted" data-status="accepted">
          <span class="avatar small-avatar">MC</span>
          <span class="student-appeal-history-copy">
            <strong>Excused tardiness request</strong>
            <small>Attendance - April 12, 2026 - CCMC</small>
            <small>Submitted April 12, 2026, 8:04 AM - 1 file attached</small>
          </span>
          <span class="status-badge status-verified">Accepted</span>
        </a>
      </div>
    </div>
  `;

  appealList = document.querySelector("#student-appeal-list");
  appealListCount = document.querySelector("#student-appeal-list-count");
}

function hasRequiredFields(formData) {
  return ["appealType", "dutyDate", "site", "area", "title", "reason", "evidence", "recommendedByCi"]
    .every((field) => String(formData.get(field) || "").trim());
}

menuButton?.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop?.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

appealForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(appealForm);

  if (!hasRequiredFields(formData)) {
    setMessage("Please complete the required appeal fields before submitting.", "is-error");
    return;
  }

  appealList?.insertAdjacentHTML("afterbegin", buildAppealCard(formData));
  appealForm.reset();
  setMessage("Appeal submitted. It is now awaiting CI recommendation.", "is-success");
  updateSummary();
});

appealForm?.addEventListener("reset", () => {
  window.setTimeout(() => {
    setMessage("Complete the appeal details to submit it for CI recommendation.");
    updateAppealFileSummary();
  }, 0);
});

appealFilesInput?.addEventListener("change", updateAppealFileSummary);

if (!renderStudentAppealDetail()) {
  renderInitialAppealHistory();
  updateAppealFileSummary();
  updateSummary();
}
