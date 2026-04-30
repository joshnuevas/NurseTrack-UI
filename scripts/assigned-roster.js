const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const table = document.querySelector("#assigned-roster-table");

const rosters = {
  "ward-b": {
    title: "Emergency Room Rotation roster.",
    heading: "Emergency Room Rotation",
    subtitle: "CCMC - May 8 - 7:00 AM to 3:00 PM",
    hospital: "CCMC",
    area: "Emergency Room",
    shift: "7:00 AM - 3:00 PM",
    group: "BSN 3A - Group 2",
    status: "Upcoming",
    students: [
      ["Maria Cruz", "MC", "BSN 3A", "Regular", "No Validation Yet"],
      ["Josh Anton Nuevas", "JA", "BSN 3A", "Regular", "No Validation Yet"],
      ["Treasure Abadinas", "TA", "BSN 3A", "Extension", "No Validation Yet"],
      ["Lichael Ursulo", "LU", "BSN 3A", "Completion", "No Validation Yet"],
      ["Jay Tiongzon", "JT", "BSN 3A", "Regular", "No Validation Yet"],
      ["Angela Neri", "AN", "BSN 3A", "Regular", "No Validation Yet"],
      ["Zander Aligato", "ZA", "BSN 3A", "Extension", "No Validation Yet"],
      ["Andrea Gomez", "AG", "BSN 3A", "Completion", "No Validation Yet"]
    ]
  },
  "delivery-room": {
    title: "Delivery Room Rotation roster.",
    heading: "Delivery Room Rotation",
    subtitle: "CCMC - May 10 - 6:00 AM to 2:00 PM",
    hospital: "CCMC",
    area: "Delivery Room",
    shift: "6:00 AM - 2:00 PM",
    group: "BSN 3A - Group 1",
    status: "Upcoming",
    students: [
      ["Treasure Abadinas", "TA", "BSN 3A", "Extension", "No Validation Yet"],
      ["Maria Cruz", "MC", "BSN 3A", "Regular", "No Validation Yet"],
      ["Josh Anton Nuevas", "JA", "BSN 3A", "Regular", "No Validation Yet"],
      ["Lichael Ursulo", "LU", "BSN 3A", "Completion", "No Validation Yet"],
      ["Jay Tiongzon", "JT", "BSN 3A", "Regular", "No Validation Yet"],
      ["Andrea Gomez", "AG", "BSN 3A", "Completion", "No Validation Yet"]
    ]
  },
  "pediatric-ward": {
    title: "Pedia Pulmo Ward roster.",
    heading: "Pedia Pulmo Ward",
    subtitle: "CCMC - May 6 - 7:00 AM to 3:00 PM",
    hospital: "CCMC",
    area: "Pedia Pulmo Ward",
    shift: "7:00 AM - 3:00 PM",
    group: "BSN 3B - Group 1",
    status: "Upcoming",
    students: [
      ["Jay Tiongzon", "JT", "BSN 3B", "Regular", "No Validation Yet"],
      ["Zander Aligato", "ZA", "BSN 3B", "Extension", "No Validation Yet"],
      ["Andrea Gomez", "AG", "BSN 3B", "Completion", "No Validation Yet"],
      ["Angela Neri", "AN", "BSN 3B", "Regular", "No Validation Yet"],
      ["Maria Cruz", "MC", "BSN 3B", "Regular", "No Validation Yet"],
      ["Lichael Ursulo", "LU", "BSN 3B", "Completion", "No Validation Yet"]
    ]
  },
  "operating-room": {
    title: "Operating Room Duty roster.",
    heading: "Operating Room Duty",
    subtitle: "VSMMC - May 9 - 8:00 AM to 5:00 PM",
    hospital: "VSMMC",
    area: "Operating Room",
    shift: "8:00 AM - 5:00 PM",
    group: "BSN 4A - Group 1",
    status: "Upcoming",
    students: [
      ["Andrea Gomez", "AG", "BSN 4A", "Completion", "No Validation Yet"],
      ["Zander Aligato", "ZA", "BSN 4A", "Extension", "No Validation Yet"],
      ["Treasure Abadinas", "TA", "BSN 4A", "Extension", "No Validation Yet"],
      ["Jay Tiongzon", "JT", "BSN 4A", "Regular", "No Validation Yet"],
      ["Maria Cruz", "MC", "BSN 4A", "Regular", "No Validation Yet"]
    ]
  }
};

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function statusClass(value) {
  if (/regular|verified|active/i.test(value)) {
    return "status-verified";
  }

  if (/extension|late|needs/i.test(value)) {
    return "status-rejected";
  }

  if (/completion|scheduled|no validation yet/i.test(value)) {
    return "status-neutral";
  }

  return "status-pending";
}

function studentSlug(name) {
  return name.toLowerCase().replaceAll(" ", "-");
}

function renderRoster() {
  const key = new URLSearchParams(window.location.search).get("rotation") || "ward-b";
  const roster = rosters[key] || rosters["ward-b"];

  roster.students.sort((a, b) => {
    const lastNameA = a[0].split(" ").pop().toLowerCase();
    const lastNameB = b[0].split(" ").pop().toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });

  setText("#roster-title", roster.title);
  setText("#roster-heading", roster.heading);
  setText("#roster-subtitle", roster.subtitle);
  setText("#roster-hospital", roster.hospital);
  setText("#roster-area", roster.area);
  setText("#roster-shift", roster.shift);
  setText("#roster-group", roster.group);
  setText("#roster-status", roster.status);
  setText("#roster-count", `${roster.students.length} students`);

  const rows = roster.students.map(([name, initials, section, duty, validation], index) => `
    <a class="assigned-roster-row" href="student-progress-detail.html?student=${studentSlug(name)}">
      <div><strong>${index + 1}.</strong></div>
      <div class="roster-student-cell">
        <span class="avatar small-avatar">${initials}</span>
        <strong>${name}</strong>
      </div>
      <div>${section}</div>
      <div><span class="status-badge ${statusClass(duty)}">${duty}</span></div>
      <div><span class="status-badge ${statusClass(validation)}">${validation}</span></div>
    </a>
  `).join("");

  table.insertAdjacentHTML("beforeend", rows);
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

renderRoster();