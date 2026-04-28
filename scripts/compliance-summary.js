const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const sectionFilter = document.querySelector("#section-filter");
const statusFilter = document.querySelector("#status-filter");
const studentSearch = document.querySelector("#student-search");
const complianceRows = Array.from(document.querySelectorAll("#compliance-table .compliance-row:not(.compliance-row-head)"));
const emptyState = document.querySelector("#compliance-empty");
const message = document.querySelector("#compliance-message");
const refreshButton = document.querySelector("#refresh-summary");

function filterCompliance() {
  const section = sectionFilter.value;
  const status = statusFilter.value;
  const query = studentSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  complianceRows.forEach((row) => {
    const matchesSection = section === "all" || row.dataset.section === section;
    const matchesStatus = status === "all" || row.dataset.status === status;
    const matchesQuery = !query || row.textContent.toLowerCase().includes(query);
    const isVisible = matchesSection && matchesStatus && matchesQuery;

    row.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  emptyState.hidden = visibleCount > 0;
  message.classList.remove("is-success", "is-error");
  message.textContent = `Showing ${visibleCount} compliance record${visibleCount === 1 ? "" : "s"}.`;
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[sectionFilter, statusFilter, studentSearch].forEach((control) => {
  control.addEventListener("input", filterCompliance);
});

refreshButton?.addEventListener("click", () => {
  filterCompliance();
  message.textContent = "Compliance summary updated.";
  message.classList.add("is-success");
});

filterCompliance();
