const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const siteFilter = document.querySelector("#attendance-site-filter");
const statusFilter = document.querySelector("#attendance-status-filter");
const attendanceSearch = document.querySelector("#attendance-search");
const attendanceRows = Array.from(document.querySelectorAll(".live-attendance-row:not(.live-attendance-head)"));
const emptyState = document.querySelector("#attendance-empty");
const visibleCount = document.querySelector("#visible-attendance-count");
const liveClock = document.querySelector("#live-clock");
const lastRefresh = document.querySelector("#last-refresh");
const syncPill = document.querySelector("#attendance-sync-pill");
const siteCards = Array.from(document.querySelectorAll("[data-site-jump]"));

function filterAttendance() {
  const site = siteFilter.value;
  const status = statusFilter.value;
  const query = attendanceSearch.value.trim().toLowerCase();
  let shown = 0;

  attendanceRows.forEach((row) => {
    const matchesSite = site === "all" || row.dataset.site === site;
    const matchesStatus = status === "all" || row.dataset.status === status;
    const matchesSearch = !query || row.textContent.toLowerCase().includes(query);
    const isVisible = matchesSite && matchesStatus && matchesSearch;

    row.hidden = !isVisible;

    if (isVisible) {
      shown += 1;
    }
  });

  visibleCount.textContent = `${shown} visible`;
  emptyState.hidden = shown > 0;
}

function updateLiveTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  liveClock.textContent = `Live session active - ${time}`;
  lastRefresh.textContent = "Last refresh just now";
  syncPill.textContent = "Live now";
}

function refreshSignalAges() {
  attendanceRows.forEach((row) => {
    const signalCell = row.querySelector("[data-live-minutes]");
    const current = Number(signalCell.dataset.liveMinutes);

    if (row.dataset.status === "pending") {
      signalCell.textContent = "Waiting";
      return;
    }

    const next = current + 1;
    signalCell.dataset.liveMinutes = String(next);
    signalCell.textContent = `${next} min ago`;
  });
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[siteFilter, statusFilter, attendanceSearch].forEach((control) => {
  control.addEventListener("input", filterAttendance);
});

siteCards.forEach((card) => {
  card.addEventListener("click", () => {
    siteCards.forEach((item) => item.classList.toggle("is-active", item === card));
    siteFilter.value = card.dataset.siteJump;
    filterAttendance();
  });
});

updateLiveTime();
filterAttendance();

window.setInterval(updateLiveTime, 15000);
window.setInterval(refreshSignalAges, 30000);
