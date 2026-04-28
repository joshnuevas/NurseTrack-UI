const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const searchInput = document.querySelector("#chair-student-search");
const sectionFilter = document.querySelector("#chair-student-section");
const readinessFilter = document.querySelector("#chair-student-readiness");
const studentCards = Array.from(document.querySelectorAll("[data-chair-student-card]"));
const studentCount = document.querySelector("#chair-student-count");
const emptyState = document.querySelector("#chair-student-empty");
const completeCount = document.querySelector("#chair-progress-complete");
const incompleteCount = document.querySelector("#chair-progress-incomplete");
const clearanceCount = document.querySelector("#chair-progress-clearance");

function filterChairStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const section = sectionFilter.value;
  const readiness = readinessFilter.value;
  let shown = 0;

  studentCards.forEach((card) => {
    const haystack = [
      card.dataset.name,
      card.dataset.id,
      card.dataset.section,
      card.dataset.ci,
      card.dataset.area,
      card.dataset.readiness,
      card.textContent
    ].join(" ").toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    const matchesSection = section === "all" || card.dataset.section === section;
    const matchesReadiness = readiness === "all" || card.dataset.readiness === readiness;
    const isVisible = matchesSearch && matchesSection && matchesReadiness;

    card.hidden = !isVisible;
    if (isVisible) {
      shown += 1;
    }
  });

  studentCount.textContent = `${shown} visible`;
  emptyState.hidden = shown > 0;
}

function updateSummaryCounts() {
  const readinessValues = studentCards.map((card) => card.dataset.readiness);
  completeCount.textContent = readinessValues.filter((status) => status === "Complete" || status === "Ready for Enrollment").length;
  incompleteCount.textContent = readinessValues.filter((status) => status === "Incomplete").length;
  clearanceCount.textContent = readinessValues.filter((status) => status === "Ready for Clearance").length;
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[searchInput, sectionFilter, readinessFilter].forEach((control) => {
  control.addEventListener("input", filterChairStudents);
});

updateSummaryCounts();
filterChairStudents();
