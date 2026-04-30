const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const form = document.querySelector("#report-form");
const reportType = document.querySelector("#report-type");
const startDate = document.querySelector("#start-date");
const endDate = document.querySelector("#end-date");
const sectionFilter = document.querySelector("#section-filter");
const siteFilter = document.querySelector("#site-filter");
const formatFilter = document.querySelector("#format-filter");
const studentSearch = document.querySelector("#student-search");
const customDropdown = document.querySelector("#custom-student-dropdown");
const message = document.querySelector("#report-message");
const previewTitle = document.querySelector("#preview-title");
const previewPeriod = document.querySelector("#preview-period");
const previewScope = document.querySelector("#preview-scope");
const previewCount = document.querySelector("#preview-count");
const previewCompleted = document.querySelector("#preview-completed");
const previewPending = document.querySelector("#preview-pending");
const previewAction = document.querySelector("#preview-action");
const quickGenerate = document.querySelector("#quick-generate");
const resetReport = document.querySelector("#reset-report");
const exportCsv = document.querySelector("#export-csv");
const exportPdf = document.querySelector("#export-pdf");

const studentReportRecords = [
  {
    name: "Maria Cruz",
    section: "BSN 3A",
    id: "12-3456-789",
    site: "CCMC",
    metrics: {
      "Compliance Summary": ["1 student record", "18", "3", "1"],
      "Duty Report": ["42 duty hours", "38", "3", "1"],
      "Case Report": ["18 case logs", "14", "3", "1"],
      "Schedule Report": ["5 assigned schedules", "5", "0", "0"]
    }
  },
  {
    name: "Josh Anton Nuevas",
    section: "BSN 3A",
    id: "12-3456-812",
    site: "CCMC",
    metrics: {
      "Compliance Summary": ["1 student record", "16", "4", "2"],
      "Duty Report": ["39 duty hours", "34", "4", "1"],
      "Case Report": ["16 case logs", "12", "3", "1"],
      "Schedule Report": ["5 assigned schedules", "4", "1", "0"]
    }
  },
  {
    name: "Treasure Abadinas",
    section: "BSN 3A",
    id: "12-3456-845",
    site: "VSMMC",
    metrics: {
      "Compliance Summary": ["1 student record", "19", "2", "0"],
      "Duty Report": ["45 duty hours", "43", "2", "0"],
      "Case Report": ["19 case logs", "17", "2", "0"],
      "Schedule Report": ["5 assigned schedules", "5", "0", "0"]
    }
  },
  {
    name: "Andrea Gomez",
    section: "BSN 3B",
    id: "12-3456-902",
    site: "CHN Brgy. Dumlog",
    metrics: {
      "Compliance Summary": ["1 student record", "17", "3", "1"],
      "Duty Report": ["40 duty hours", "36", "3", "1"],
      "Case Report": ["17 case logs", "13", "3", "1"],
      "Schedule Report": ["4 assigned schedules", "4", "0", "0"]
    }
  },
  {
    name: "Lichael Ursulo",
    section: "BSN 3C",
    id: "12-3456-976",
    site: "CSMC",
    metrics: {
      "Compliance Summary": ["1 student record", "15", "4", "1"],
      "Duty Report": ["37 duty hours", "32", "4", "1"],
      "Case Report": ["15 case logs", "11", "3", "1"],
      "Schedule Report": ["4 assigned schedules", "4", "0", "0"]
    }
  },
  {
    name: "Angela Neri",
    section: "BSN 3C",
    id: "12-3456-988",
    site: "CSMC",
    metrics: {
      "Compliance Summary": ["1 student record", "14", "5", "1"],
      "Duty Report": ["35 duty hours", "30", "5", "0"],
      "Case Report": ["14 case logs", "10", "3", "1"],
      "Schedule Report": ["4 assigned schedules", "3", "1", "0"]
    }
  }
];

const reportMetrics = document.body.dataset.reportScope === "student" ? {
  "Compliance Summary": ["42 records", "31", "9", "2"],
  "Duty Report": ["128 duty hours", "96", "24", "8"],
  "Case Report": ["34 case logs", "27", "5", "2"],
  "Schedule Report": ["5 schedules", "4", "1", "0"],
  "Lacking Duty Hours": ["24 hours lacking", "96", "24", "8"],
  "Lacking Clinical Cases": ["10 case items lacking", "14", "6", "4"],
  "Late Attendance Records": ["3 late entries", "2", "1", "0"],
  "Not Applicable Records": ["2 case records", "0", "0", "2"],
  "Group Progress": ["1 active group", "3", "1", "0"],
  "CI Assigned Student Status": ["1 assigned CI", "4", "1", "0"]
} : {
  "Compliance Summary": ["42 students", "31", "9", "2"],
  "Duty Report": ["318 duty records", "246", "58", "14"],
  "Case Report": ["186 case logs", "142", "36", "8"],
  "Schedule Report": ["28 schedules", "22", "4", "2"],
  "Lacking Duty Hours": ["58 duty gaps", "246", "58", "14"],
  "Lacking Clinical Cases": ["36 case gaps", "142", "36", "8"],
  "Late Attendance Records": ["14 late entries", "9", "3", "2"],
  "Not Applicable Records": ["8 records", "0", "0", "8"],
  "Group Progress": ["12 active groups", "9", "2", "1"],
  "CI Assigned Student Status": ["6 instructors", "31", "9", "2"]
};

// Handle Custom Autocomplete Dropdown
function renderDropdown(query = "") {
  customDropdown.innerHTML = "";
  const normalizedWords = query.toLowerCase().trim().split(/\s+/);

  // Filter students based on query
  const filteredStudents = studentReportRecords.filter((student) => {
    if (!query) return true; // Show all if empty
    const searchable = `${student.name} ${student.section} ${student.id} ${student.site}`.toLowerCase();
    return normalizedWords.every(word => searchable.includes(word));
  });

  if (filteredStudents.length === 0) {
    customDropdown.innerHTML = `<div class="custom-dropdown-empty">No students found matching "${query}"</div>`;
    return;
  }

  // Build the list
  filteredStudents.forEach(student => {
    const item = document.createElement("div");
    item.className = "custom-dropdown-item";
    item.innerHTML = `
      <strong>${student.name}</strong>
      <small>${student.id} | ${student.section}</small>
    `;
    
    // Select student on click
    item.addEventListener("click", () => {
      studentSearch.value = student.name;
      customDropdown.hidden = true;
      updatePreview();
    });
    
    customDropdown.appendChild(item);
  });
}

// Show dropdown on focus or typing
studentSearch.addEventListener("focus", () => {
  renderDropdown(studentSearch.value);
  customDropdown.hidden = false;
});

studentSearch.addEventListener("input", (e) => {
  renderDropdown(e.target.value);
  customDropdown.hidden = false;
  updatePreview();
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!studentSearch.contains(e.target) && !customDropdown.contains(e.target)) {
    customDropdown.hidden = true;
  }
});

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function setMessage(text, state) {
  message.textContent = text;
  message.classList.remove("is-error", "is-success");

  if (state) {
    message.classList.add(state);
  }
}

function findStudentRecord(query) {
  const normalizedWords = query.toLowerCase().trim().split(/\s+/);
  return studentReportRecords.find((student) => {
    const searchable = `${student.name} ${student.section} ${student.id} ${student.site}`.toLowerCase();
    return normalizedWords.every(word => searchable.includes(word));
  });
}

function updatePreview() {
  const studentQuery = studentSearch?.value.trim() || "";
  const studentRecord = studentQuery ? findStudentRecord(studentQuery) : null;
  const defaultMetrics = reportMetrics[reportType.value] || reportMetrics["Compliance Summary"];
  const metrics = studentQuery
    ? studentRecord?.metrics[reportType.value] || ["1 student record", "1", "0", "0"]
    : defaultMetrics;
  const studentScope = studentRecord
    ? `${studentRecord.name} (${studentRecord.section})`
    : studentQuery;

  previewTitle.textContent = reportType.value;
  previewPeriod.textContent = `${formatDate(startDate.value)} - ${formatDate(endDate.value)}`;
  previewScope.textContent = studentQuery
    ? `${studentScope} - ${studentRecord?.site || siteFilter.value}`
    : `${sectionFilter.value} - ${siteFilter.value}`;
  previewCount.textContent = metrics[0];
  previewCompleted.textContent = metrics[1];
  previewPending.textContent = metrics[2];
  previewAction.textContent = metrics[3];
}

function generatePreview() {
  if (studentSearch && !studentSearch.value.trim()) {
    setMessage("Search an assigned student before generating the report.", "is-error");
    studentSearch.focus();
    return;
  }

  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    setMessage("End date must be later than the start date.", "is-error");
    endDate.focus();
    return;
  }

  updatePreview();
  const studentQuery = studentSearch?.value.trim();
  const studentRecord = studentQuery ? findStudentRecord(studentQuery) : null;
  const target = studentQuery ? ` for ${studentRecord?.name || studentQuery}` : "";

  setMessage(`${reportType.value} report generated${target} successfully.`, "is-success");
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[reportType, startDate, endDate, sectionFilter, siteFilter].filter(Boolean).forEach((control) => {
  control.addEventListener("input", updatePreview);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generatePreview();
});

quickGenerate?.addEventListener("click", generatePreview);

resetReport.addEventListener("click", () => {
  form.reset();
  updatePreview();
  setMessage("Report filters reset.", "is-success");
});

exportCsv.addEventListener("click", () => {
  setMessage(`${reportType.value} CSV export is ready.`, "is-success");
  formatFilter.value = "CSV";
});

exportPdf.addEventListener("click", () => {
  setMessage(`${reportType.value} PDF export is ready.`, "is-success");
  formatFilter.value = "PDF";
});

updatePreview();