const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const searchInput = document.querySelector("#validation-user-search");
const sectionFilter = document.querySelector("#validation-user-section");
const typeFilter = document.querySelector("#validation-record-type");
const userCards = Array.from(document.querySelectorAll("[data-validation-user]"));
const userCount = document.querySelector("#validation-user-count");
const selectionMessage = document.querySelector("#validation-selection-message");
const selectedAvatar = document.querySelector("#selected-validation-avatar");
const selectedName = document.querySelector("#selected-validation-name");
const selectedMeta = document.querySelector("#selected-validation-meta");
const selectedArea = document.querySelector("#selected-validation-area");
const selectedCount = document.querySelector("#selected-validation-count");
const selectedDuty = document.querySelector("#selected-validation-duty");
const selectedCase = document.querySelector("#selected-validation-case");
const dutyLink = document.querySelector("#selected-duty-link");
const caseLink = document.querySelector("#selected-case-link");

function pendingLabel(count) {
  return `${count} pending`;
}

function pendingTotal(card) {
  return Number(card.dataset.duty) + Number(card.dataset.case);
}

function setSelectedUser(card) {
  userCards.forEach((item) => item.classList.toggle("is-selected", item === card));

  const dutyCount = Number(card.dataset.duty);
  const caseCount = Number(card.dataset.case);
  const total = dutyCount + caseCount;

  selectedAvatar.textContent = card.dataset.initials;
  selectedName.textContent = card.dataset.name;
  selectedMeta.textContent = `${card.dataset.section} - Student ID ${card.dataset.studentId}`;
  selectedArea.textContent = `Assigned area: ${card.dataset.area}`;
  selectedCount.textContent = pendingLabel(total);
  selectedDuty.textContent = pendingLabel(dutyCount);
  selectedCase.textContent = pendingLabel(caseCount);
  dutyLink.href = card.dataset.dutyLink;
  caseLink.href = card.dataset.caseLink;
  dutyLink.classList.toggle("is-disabled", dutyCount === 0);
  caseLink.classList.toggle("is-disabled", caseCount === 0);
  selectionMessage.textContent = `${card.dataset.name} is selected.`;
}

function filterUsers() {
  const query = searchInput.value.trim().toLowerCase();
  const section = sectionFilter.value;
  const type = typeFilter.value;
  let visibleCount = 0;

  userCards.forEach((card) => {
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query) || card.dataset.area.toLowerCase().includes(query);
    const matchesSection = section === "all" || card.dataset.section === section;
    const matchesType = type === "all" || card.dataset.types.includes(type);
    const isVisible = matchesQuery && matchesSection && matchesType;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  userCount.textContent = `${visibleCount} student${visibleCount === 1 ? "" : "s"}`;
  selectionMessage.textContent = visibleCount
    ? `Showing ${visibleCount} student${visibleCount === 1 ? "" : "s"}.`
    : "No students match the current filters.";
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[searchInput, sectionFilter, typeFilter].forEach((control) => {
  control.addEventListener("input", filterUsers);
});

userCards.forEach((card) => {
  card.addEventListener("click", () => setSelectedUser(card));
});

setSelectedUser(userCards[0]);
