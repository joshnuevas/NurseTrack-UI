const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const appealForm = document.querySelector("#student-appeal-form");
const appealMessage = document.querySelector("#student-appeal-message");
const appealList = document.querySelector("#student-appeal-list");
const appealListCount = document.querySelector("#student-appeal-list-count");
const submittedCount = document.querySelector("#student-appeal-submitted-count");
const recommendedCount = document.querySelector("#student-appeal-recommended-count");
const approvedCount = document.querySelector("#student-appeal-approved-count");
const syncPill = document.querySelector("#student-appeal-sync");
const heroStatus = document.querySelector("#student-appeal-hero-status");

const typeLabels = {
  attendance: "Attendance",
  schedule: "Schedule",
  case: "Clinical case"
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
  return `${month}/${day}/${year}`;
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
  const cards = Array.from(appealList?.querySelectorAll(".appeal-card") || []);
  const submitted = cards.filter((card) => card.dataset.status === "submitted").length;
  const recommended = cards.filter((card) => card.dataset.status === "recommended").length;
  const approved = cards.filter((card) => card.dataset.status === "approved").length;
  const open = submitted + recommended;

  if (appealListCount) {
    appealListCount.textContent = `${cards.length} record${cards.length === 1 ? "" : "s"}`;
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
  const reason = escapeHtml(String(formData.get("reason") || "").trim());
  const evidence = escapeHtml(String(formData.get("evidence") || "").trim());
  const relatedDate = formatDate(String(formData.get("dutyDate") || ""));
  const ci = escapeHtml(String(formData.get("recommendedByCi") || "").trim());

  return `
    <article class="appeal-card" data-status="submitted">
      <div class="appeal-card-head">
        <div class="appeal-student-cell">
          <div class="avatar small-avatar">MC</div>
          <div>
            <strong>Maria Cruz</strong>
            <p>BSN 3A - Student ID 12-3456-789</p>
          </div>
        </div>
        <div class="appeal-card-badges">
          <span class="status-badge status-pending">Submitted by Student</span>
          <span class="status-badge status-pending">Awaiting ${ci || "CI"} recommendation</span>
        </div>
      </div>

      <div class="appeal-card-body">
        <div class="appeal-title-row">
          <div>
            <span class="appeal-type-label">${typeLabels[type] || "Appeal"}</span>
            <h3>${title}</h3>
          </div>
          <span class="appeal-submitted">Just now</span>
        </div>

        <div class="appeal-fact-grid">
          <div>
            <span>Related duty date</span>
            <strong>${relatedDate}</strong>
          </div>
          <div>
            <span>Clinical site</span>
            <strong>${site}</strong>
          </div>
          <div>
            <span>Duty area</span>
            <strong>${area}</strong>
          </div>
        </div>

        <div class="appeal-detail-grid">
          <div class="appeal-detail-note">
            <span>Student reason</span>
            <p>${reason}</p>
          </div>
          <div class="appeal-detail-note">
            <span>Supporting evidence</span>
            <p>${evidence}</p>
          </div>
        </div>
      </div>
    </article>
  `;
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
  }, 0);
});

updateSummary();
