const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const viewButtons = document.querySelectorAll("[data-management-view]");
const calendarView = document.querySelector("#calendar-view");
const listView = document.querySelector("#list-view");
const statusFilter = document.querySelector("#status-filter");
const areaFilter = document.querySelector("#area-filter");
const scheduleSearch = document.querySelector("#schedule-search");
const scheduleRows = Array.from(document.querySelectorAll(".management-row"));
const calendarDays = Array.from(document.querySelectorAll(".management-day[data-status]"));
const emptyState = document.querySelector("#schedule-empty");

function setView(view) {
  viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.managementView === view);
  });

  calendarView.hidden = view !== "calendar";
  listView.hidden = view !== "list";
  filterSchedules();
}

function filterItems(items) {
  const status = statusFilter.value;
  const area = areaFilter.value;
  const query = scheduleSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  items.forEach((item) => {
    const matchesStatus = status === "all" || item.dataset.status === status;
    const matchesArea = area === "all" || item.dataset.area === area;
    const matchesQuery = !query || item.textContent.toLowerCase().includes(query);
    const isVisible = matchesStatus && matchesArea && matchesQuery;

    item.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  return visibleCount;
}

function filterSchedules() {
  const visibleCount = listView.hidden ? filterItems(calendarDays) : filterItems(scheduleRows);
  emptyState.hidden = visibleCount > 0;
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.managementView));
});

[statusFilter, areaFilter, scheduleSearch].forEach((control) => {
  control.addEventListener("input", filterSchedules);
});

filterSchedules();
