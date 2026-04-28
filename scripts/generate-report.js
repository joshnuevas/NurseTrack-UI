const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const form = document.querySelector("#report-form");
const reportType = document.querySelector("#report-type");
const startDate = document.querySelector("#start-date");
const endDate = document.querySelector("#end-date");
const sectionFilter = document.querySelector("#section-filter");
const siteFilter = document.querySelector("#site-filter");
const formatFilter = document.querySelector("#format-filter");
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

function updatePreview() {
  const metrics = reportMetrics[reportType.value] || reportMetrics["Compliance Summary"];

  previewTitle.textContent = reportType.value;
  previewPeriod.textContent = `${formatDate(startDate.value)} - ${formatDate(endDate.value)}`;
  previewScope.textContent = `${sectionFilter.value} - ${siteFilter.value}`;
  previewCount.textContent = metrics[0];
  previewCompleted.textContent = metrics[1];
  previewPending.textContent = metrics[2];
  previewAction.textContent = metrics[3];
}

function generatePreview() {
  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    setMessage("End date must be later than the start date.", "is-error");
    endDate.focus();
    return;
  }

  updatePreview();
  setMessage(`${reportType.value} preview generated successfully.`, "is-success");
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[reportType, startDate, endDate, sectionFilter, siteFilter].forEach((control) => {
  control.addEventListener("input", updatePreview);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generatePreview();
});

quickGenerate.addEventListener("click", generatePreview);

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
