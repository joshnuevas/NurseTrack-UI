const chairMakerFileButton = document.querySelector("[data-chair-file-select]");
const chairMakerFileInput = document.querySelector("[data-chair-file-input]");
const chairMakerManualButton = document.querySelector("[data-create-manual-schedule]");
const chairMakerImportStatus = document.querySelector("#chair-import-status");
const chairMakerImportMessage = document.querySelector("#chair-import-message");
const chairMakerScheduleStatus = document.querySelector("#chair-schedule-status");
const chairMakerScheduleMessage = document.querySelector("#chair-schedule-message");
const chairMakerImportedFile = document.querySelector("#chair-imported-file");
const chairMakerDraftList = document.querySelector(".schedule-draft-list");
const chairMakerPublishButton = document.querySelector("[data-publish-schedule]");
const chairMakerRosterModal = document.querySelector("#schedule-roster-modal");
const chairMakerRosterTitle = document.querySelector("#schedule-roster-title");
const chairMakerRosterList = document.querySelector("#schedule-roster-list");
const chairMakerRosterCloseButtons = Array.from(document.querySelectorAll("[data-close-roster-modal]"));
const chairMakerRosterUndoButton = document.querySelector("[data-undo-roster-remove]");

const chairMakerRosterData = {
  "N1 G1": ["Zander Aligato", "Bianca Mariel Lumbre", "Klarisse Mumar", "Shaina Perez", "Rui Parba", "Relieza Rellon", "Ella Mae Maranga", "Hannah Louise Maturan", "Geralf Mojana", "Treshia Pinca"],
  "N1 G2": ["Maria Cruz", "Treasure Abadinas", "Carlo Fernandez", "Josh Anton Nuevas", "Jasmine Lim", "Kaye Amor", "Bea Arocha", "Grace Alolor", "Mae Arquiza", "Ivanka Arreglo"],
  "N1 G3": ["Lady Dacayana", "Zyrelle Dianon", "Vera Doroon", "Shennen Dungcoy", "Mary Cielo Fernandez", "Jenelou Francis", "Nicole Reroma", "Elisabeth Robledo", "Rojhel Saavedra", "Marian Paradiang"],
  "N1 G4": ["Jane Rea Basalo", "Bea Mae Batarilan", "Yelrich Bejoc", "Crystal Dela Calzada", "Nicole Dela Calzada", "Clark Leonor", "Chloe Relova", "Michelle Teano", "Oishi Valcorza"],
  "N2 G3": ["Rui Vil Parba", "Shaina Perez", "Relieza Rellon", "Ella Mae Maranga", "Hannah Louise Maturan", "Geralf Mojana", "Treshia Pinca", "Klarisse Mumar", "Bianca Mariel Lumbre", "Zander Aligato"],
  "N2 G4": ["Marian Paradiang", "Rui Vil Parba", "Shaina Perez", "Relieza Rellon", "Nicole Reroma", "Elisabeth Robledo", "Rojhel Saavedra", "Lady Dacayana", "Zyrelle Dianon"]
};

let chairMakerRemovedStudents = [];

function setChairMakerMessage(element, message, isSuccess = true) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.toggle("is-success", isSuccess);
  element.classList.toggle("is-error", !isSuccess);
}

function setChairMakerStatus(element, text, statusClass) {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.className = `status-badge ${statusClass}`;
}

function syncChairMakerCasePresentation(row) {
  const tbaOption = row?.querySelector("[data-case-presentation-tba]");
  const inputs = Array.from(row?.querySelectorAll("[data-case-presentation-input]") || []);
  const isTba = Boolean(tbaOption?.checked);

  inputs.forEach((input) => {
    input.disabled = isTba;
    if (isTba) {
      input.value = "";
    }
  });
}

function bindChairMakerTbaRows() {
  document.querySelectorAll("[data-schedule-draft-row]").forEach(syncChairMakerCasePresentation);
}

function getChairMakerInitials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function closeChairMakerRosterModal() {
  if (!chairMakerRosterModal) {
    return;
  }

  chairMakerRosterModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function openChairMakerRosterModal(group) {
  if (!chairMakerRosterModal || !chairMakerRosterList) {
    return;
  }

  const students = chairMakerRosterData[group] || [];

  if (chairMakerRosterUndoButton) {
    chairMakerRosterUndoButton.disabled = !chairMakerRemovedStudents.some((item) => item.group === group);
  }

  if (chairMakerRosterTitle) {
    chairMakerRosterTitle.textContent = `${group} students`;
  }

  chairMakerRosterList.innerHTML = `
    <div class="assigned-roster-row assigned-roster-head schedule-roster-row">
      <span>No.</span>
      <span>Student</span>
      <span>Section</span>
      <span>Action</span>
    </div>
    ${students.map((student, index) => `
      <div class="assigned-roster-row schedule-roster-row" data-roster-student-row>
        <span>${index + 1}.</span>
        <div class="roster-student-cell">
          <span class="avatar small-avatar">${getChairMakerInitials(student)}</span>
          <strong>${student}</strong>
        </div>
        <span>${group}</span>
        <button class="ghost-button danger-action schedule-roster-remove" type="button" data-remove-roster-student data-roster-group="${group}" data-roster-student="${student}">Remove</button>
      </div>
    `).join("")}
  `;

  chairMakerRosterModal.hidden = false;
  document.body.classList.add("modal-open");
}

function createManualScheduleRow() {
  const manualCount = document.querySelectorAll("[data-schedule-draft-row]").length + 1;
  const row = document.createElement("div");
  row.className = "schedule-draft-row is-edited";
  row.dataset.scheduleDraftRow = "";
  row.innerHTML = `
    <div class="schedule-draft-main">
      <div><strong>Manual Schedule ${manualCount}</strong><button class="roster-count-button" type="button" data-view-draft-roster data-roster-group="Manual Schedule ${manualCount}">0 students</button></div>
    </div>
    <div class="schedule-draft-actions">
      <button class="ghost-button" type="button" data-save-draft-row>Save edits</button>
      <button class="ghost-button danger-action" type="button" data-remove-draft-row>Remove</button>
    </div>
    <div class="schedule-draft-fields">
      <label class="form-label">Start date
        <input type="date">
      </label>
      <label class="form-label">End date
        <input type="date">
      </label>
      <label class="form-label">Hospital / Area
        <select>
          <option>SAMCH - Delivery Room</option>
          <option>CCMC - Emergency Room</option>
          <option>CCMC - Operating Room</option>
          <option>CHN Brgy. Dumlog - Community Health Nursing Area</option>
        </select>
      </label>
      <label class="form-label">Shift start
        <input type="time">
      </label>
      <label class="form-label">Shift end
        <input type="time">
      </label>
      <label class="form-label">Case presentation date
        <input type="date" data-case-presentation-input>
      </label>
      <label class="form-label">Case presentation time
        <input type="time" data-case-presentation-input>
      </label>
      <label class="checkbox-line">
        <input type="checkbox" data-case-presentation-tba checked>
        TBA
      </label>
      <label class="form-label">Supervising CI
        <select>
          <option>Patricia Reyes, RN, MAN</option>
          <option>Miguel Santos, RN, MAN</option>
          <option>Elena Dela Cruz, RN, MN, DSCN</option>
          <option>Louise Wong</option>
          <option>Rivelyn Altamira</option>
        </select>
      </label>
    </div>
  `;

  chairMakerDraftList?.append(row);
  syncChairMakerCasePresentation(row);
  setChairMakerStatus(chairMakerScheduleStatus, "Edited draft", "status-pending");
  setChairMakerMessage(chairMakerScheduleMessage, "Manual schedule added. Fill the fields, save, then publish when ready.");
}

chairMakerFileButton?.addEventListener("click", () => {
  chairMakerFileInput?.click();
  setChairMakerStatus(chairMakerImportStatus, "File selected", "status-pending");
  setChairMakerMessage(chairMakerImportMessage, "Schedule source file selected. Edit the schedule rows before publishing.");
});

chairMakerFileInput?.addEventListener("change", () => {
  const fileName = chairMakerFileInput.files?.[0]?.name || "selected file";

  if (chairMakerImportedFile) {
    chairMakerImportedFile.textContent = fileName;
  }

  setChairMakerStatus(chairMakerImportStatus, "File selected", "status-pending");
  setChairMakerMessage(chairMakerImportMessage, `${fileName} selected. Edit the schedule rows before publishing.`);
});

chairMakerManualButton?.addEventListener("click", () => {
  window.location.href = "manual-schedule.html";
});

chairMakerDraftList?.addEventListener("click", (event) => {
  const target = event.target;
  const row = target.closest("[data-schedule-draft-row]");

  if (!row) {
    return;
  }

  if (target.matches("[data-save-draft-row]")) {
    row.classList.add("is-edited");
    setChairMakerStatus(chairMakerScheduleStatus, "Edited draft", "status-pending");
    setChairMakerMessage(chairMakerScheduleMessage, "Schedule row saved. Publish or republish when the schedule is correct.");
  }

  if (target.matches("[data-view-draft-roster]")) {
    openChairMakerRosterModal(target.dataset.rosterGroup || row.querySelector("strong")?.textContent.trim() || "Schedule");
  }

  if (target.matches("[data-remove-draft-row]")) {
    const group = row.querySelector("strong")?.textContent.trim() || "Schedule";
    row.remove();
    setChairMakerStatus(chairMakerScheduleStatus, "Edited draft", "status-pending");
    setChairMakerMessage(chairMakerScheduleMessage, `${group} removed from this draft. Publish or republish when the schedule is correct.`);
  }
});

chairMakerDraftList?.addEventListener("change", (event) => {
  if (event.target.matches("[data-case-presentation-tba]")) {
    syncChairMakerCasePresentation(event.target.closest("[data-schedule-draft-row]"));
  }
});

chairMakerPublishButton?.addEventListener("click", () => {
  setChairMakerStatus(chairMakerScheduleStatus, "Published", "status-verified");
  setChairMakerMessage(chairMakerScheduleMessage, "Schedule published to Nursing Students and Clinical Instructors. You can still edit and republish changes.");
});

chairMakerRosterCloseButtons.forEach((button) => {
  button.addEventListener("click", closeChairMakerRosterModal);
});

chairMakerRosterUndoButton?.addEventListener("click", () => {
  const openGroup = chairMakerRosterTitle?.textContent.replace(" students", "");
  const undoIndex = chairMakerRemovedStudents.map((item) => item.group).lastIndexOf(openGroup);

  if (undoIndex < 0) {
    return;
  }

  const { group, student, index } = chairMakerRemovedStudents[undoIndex];
  const roster = chairMakerRosterData[group] || [];

  if (!roster.includes(student)) {
    roster.splice(Math.min(index, roster.length), 0, student);
    chairMakerRosterData[group] = roster;
  }

  chairMakerRemovedStudents.splice(undoIndex, 1);
  openChairMakerRosterModal(group);
  setChairMakerStatus(chairMakerScheduleStatus, "Edited draft", "status-pending");
  setChairMakerMessage(chairMakerScheduleMessage, `${student} restored to ${group}.`);
});

chairMakerRosterModal?.addEventListener("click", (event) => {
  if (event.target === chairMakerRosterModal) {
    closeChairMakerRosterModal();
  }

  const removeButton = event.target.closest("[data-remove-roster-student]");

  if (removeButton) {
    const group = removeButton.dataset.rosterGroup;
    const student = removeButton.dataset.rosterStudent;
    const removedIndex = (chairMakerRosterData[group] || []).findIndex((name) => name === student);

    chairMakerRemovedStudents.push({ group, student, index: Math.max(removedIndex, 0) });
    chairMakerRosterData[group] = (chairMakerRosterData[group] || []).filter((name) => name !== student);
    openChairMakerRosterModal(group);
    setChairMakerStatus(chairMakerScheduleStatus, "Edited draft", "status-pending");
    setChairMakerMessage(chairMakerScheduleMessage, `${student} removed from ${group}. Save edits or publish when ready.`);
  }
});

bindChairMakerTbaRows();
