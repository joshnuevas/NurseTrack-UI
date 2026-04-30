const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const siteFilter = document.querySelector("#attendance-site-filter");
const attendanceSearch = document.querySelector("#attendance-search");
const tableContainer = document.querySelector("#live-attendance-table");
let attendanceRows = Array.from(document.querySelectorAll(".live-attendance-row:not(.live-attendance-head)"));
const emptyState = document.querySelector("#attendance-empty");
const syncPill = document.querySelector("#attendance-sync-pill");
const siteCards = Array.from(document.querySelectorAll("[data-site-jump]"));
const OVERTIME_MINUTES = 8 * 60;

const statusDetails = {
  present: {
    label: "Present",
    badgeClass: "status-verified"
  },
  overtime: {
    label: "Overtime",
    badgeClass: "status-pending"
  }
};

function sortAttendanceAlphabetically() {
  attendanceRows.sort((a, b) => {
    const nameA = a.querySelector("strong").textContent.trim();
    const nameB = b.querySelector("strong").textContent.trim();
    const lastNameA = nameA.split(" ").pop().toLowerCase();
    const lastNameB = nameB.split(" ").pop().toLowerCase();

    return lastNameA.localeCompare(lastNameB);
  });

  attendanceRows.forEach((row) => {
    tableContainer.appendChild(row);
  });
}

function filterAttendance() {
  updateConnectedTimes();

  const site = siteFilter.value;
  const query = attendanceSearch.value.trim().toLowerCase();
  let shown = 0;

  attendanceRows.forEach((row) => {
    const isConnected = row.dataset.connected === "true";
    const matchesSite = row.dataset.site === site;
    const matchesSearch = !query || row.textContent.toLowerCase().includes(query);
    const isVisible = isConnected && matchesSite && matchesSearch;

    row.hidden = !isVisible;

    if (isVisible) {
      shown += 1;
    }
  });

  emptyState.hidden = shown > 0;
}

function updateLiveTime() {
  if (syncPill) {
    syncPill.textContent = "Live now";
  }
}

function parseCheckInTime(value) {
  const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date;
}

function formatConnectedTime(totalMinutes) {
  const safeMinutes = Math.max(0, totalMinutes);
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min`;
}

function setRowStatus(row, status) {
  const details = statusDetails[status] || statusDetails.present;
  const badge = row.querySelector(".status-badge");

  row.dataset.status = status;

  if (badge) {
    badge.textContent = details.label;
    badge.className = `status-badge ${details.badgeClass}`;
  }
}

function updateConnectedTimes() {
  attendanceRows.forEach((row) => {
    const connectedCell = row.querySelector("[data-live-minutes]");

    if (!connectedCell) {
      return;
    }

    const checkInText = row.children[2]?.textContent.trim();
    const checkInDate = parseCheckInTime(checkInText);

    if (!checkInDate) {
      row.dataset.connected = "false";
      connectedCell.textContent = "";
      setRowStatus(row, "present");
      return;
    }

    row.dataset.connected = "true";

    const connectedMinutes = Math.max(0, Math.floor((Date.now() - checkInDate.getTime()) / 60000));
    connectedCell.textContent = formatConnectedTime(connectedMinutes);

    if (connectedMinutes >= OVERTIME_MINUTES) {
      setRowStatus(row, "overtime");
      return;
    }

    setRowStatus(row, "present");
  });
}

if (menuButton) {
  menuButton.addEventListener("click", () => {
    document.body.classList.add("sidebar-open");
  });
}

if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener("click", () => {
    document.body.classList.remove("sidebar-open");
  });
}

[siteFilter, attendanceSearch].forEach((control) => {
  if (control) {
    control.addEventListener("input", filterAttendance);
  }
});

if (siteCards.length > 0) {
  siteCards.forEach((card) => {
    card.addEventListener("click", () => {
      siteCards.forEach((item) => {
        item.classList.toggle("is-active", item === card);
      });

      if (siteFilter) {
        siteFilter.value = card.dataset.siteJump;
      }

      filterAttendance();
    });
  });
}

sortAttendanceAlphabetically();
updateLiveTime();
filterAttendance();

window.setInterval(updateLiveTime, 15000);

window.setInterval(() => {
  updateConnectedTimes();
  filterAttendance();
}, 30000);