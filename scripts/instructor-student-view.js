const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const studentSearch = document.querySelector("#student-progress-search");
const sectionFilter = document.querySelector("#student-progress-section");
const standingFilter = document.querySelector("#student-progress-status");
const studentCards = Array.from(document.querySelectorAll("[data-student-progress-card]"));
const studentEmpty = document.querySelector("#student-progress-empty");
const studentCount = document.querySelector("#student-progress-count");
const assignedInstructor = document.querySelector(".sidebar-account strong")?.textContent.trim() || "Prof. Reyes";

function filterStudentCards() {
  const query = studentSearch.value.trim().toLowerCase();
  const section = sectionFilter.value;
  const standing = standingFilter.value;
  let visibleCount = 0;

  studentCards.forEach((card) => {
    const matchesAssignedInstructor = card.dataset.assignedCi === assignedInstructor;
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query) || Object.values(card.dataset).join(" ").toLowerCase().includes(query);
    const matchesSection = section === "all" || card.dataset.section === section;
    const matchesStanding = standing === "all" || card.dataset.status === standing;
    const isVisible = matchesAssignedInstructor && matchesQuery && matchesSection && matchesStanding;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  studentCount.textContent = `${visibleCount} assigned visible`;
  studentEmpty.hidden = visibleCount > 0;
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[studentSearch, sectionFilter, standingFilter].forEach((control) => {
  control.addEventListener("input", filterStudentCards);
});

filterStudentCards();
