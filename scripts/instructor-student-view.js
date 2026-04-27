const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const filterButtons = Array.from(document.querySelectorAll("[data-record-filter]"));
const recordItems = Array.from(document.querySelectorAll("#student-record-list .submission-item"));
const recordMessage = document.querySelector("#record-message");

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
