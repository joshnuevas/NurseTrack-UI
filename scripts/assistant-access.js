const ASSISTANT_ACCESS_KEYS = {
  assistant: {
    manualBackup: "nursetrack-assistant-manual-backup-access",
    clearance: "nursetrack-assistant-clearance-access",
    clinicalCases: "nursetrack-assistant-clinical-cases-access",
    ciRecommendations: "nursetrack-assistant-ci-recommendations-access"
  },
  coordinator: {
    manualBackup: "nursetrack-coordinator-manual-backup-access",
    clearance: "nursetrack-coordinator-clearance-access",
    clinicalCases: "nursetrack-coordinator-clinical-cases-access",
    ciRecommendations: "nursetrack-coordinator-ci-recommendations-access"
  }
};

const controls = Array.from(document.querySelectorAll("[data-access-role][data-access-module]"));
const message = document.querySelector("#assistant-access-message");

function getAccessKey(role, module) {
  return ASSISTANT_ACCESS_KEYS[role]?.[module] || "";
}

function isModuleEnabled(role, module) {
  const key = getAccessKey(role, module);
  return key ? window.localStorage.getItem(key) === "true" : false;
}

function setModuleEnabled(role, module, enabled) {
  const key = getAccessKey(role, module);

  if (!key) {
    return;
  }

  window.localStorage.setItem(key, enabled ? "true" : "false");
}

function countEnabledByRole(role) {
  return Object.keys(ASSISTANT_ACCESS_KEYS[role] || {}).filter((module) => {
    return isModuleEnabled(role, module);
  }).length;
}

function renderAccessState() {
  controls.forEach((control) => {
    const role = control.dataset.accessRole;
    const module = control.dataset.accessModule;

    control.checked = isModuleEnabled(role, module);
  });

  if (message) {
    const assistantCount = countEnabledByRole("assistant");
    const coordinatorCount = countEnabledByRole("coordinator");
    const totalCount = assistantCount + coordinatorCount;

    message.textContent = totalCount
      ? `Assistant: ${assistantCount} edit permission${assistantCount === 1 ? "" : "s"} enabled. Coordinator: ${coordinatorCount} edit permission${coordinatorCount === 1 ? "" : "s"} enabled.`
      : "Assistant and Coordinator edit permissions are off by default. View access remains available for every review page.";

    message.classList.toggle("is-success", totalCount > 0);
  }
}

controls.forEach((control) => {
  control.addEventListener("change", () => {
    const role = control.dataset.accessRole;
    const module = control.dataset.accessModule;

    setModuleEnabled(role, module, control.checked);
    renderAccessState();
  });
});

renderAccessState();