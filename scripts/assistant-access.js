const ASSISTANT_ACCESS_KEYS = {
  manualBackup: "nursetrack-assistant-manual-backup-access",
  clearance: "nursetrack-assistant-clearance-access",
  clinicalCases: "nursetrack-assistant-clinical-cases-access",
  ciRecommendations: "nursetrack-assistant-ci-recommendations-access"
};

const controls = Array.from(document.querySelectorAll("[data-assistant-access]"));
const statusBadges = Array.from(document.querySelectorAll("[data-assistant-access-status]"));
const message = document.querySelector("#assistant-access-message");

function isAssistantModuleEnabled(key) {
  return window.localStorage.getItem(ASSISTANT_ACCESS_KEYS[key]) === "true";
}

function renderAssistantAccessState() {
  controls.forEach((control) => {
    control.checked = isAssistantModuleEnabled(control.dataset.assistantAccess);
  });

  statusBadges.forEach((badge) => {
    const enabled = isAssistantModuleEnabled(badge.dataset.assistantAccessStatus);
    badge.textContent = enabled ? "On" : "Off";
    badge.className = `status-badge ${enabled ? "status-verified" : "status-pending"}`;
  });

  if (message) {
    const enabledCount = Object.keys(ASSISTANT_ACCESS_KEYS).filter(isAssistantModuleEnabled).length;
    message.textContent = enabledCount
      ? `${enabledCount} Assistant edit permission${enabledCount === 1 ? "" : "s"} enabled. View access remains available for every review page.`
      : "All Assistant edit permissions are off by default. View access remains available for every review page.";
    message.classList.toggle("is-success", enabledCount > 0);
  }
}

controls.forEach((control) => {
  control.addEventListener("change", () => {
    const key = control.dataset.assistantAccess;
    window.localStorage.setItem(ASSISTANT_ACCESS_KEYS[key], control.checked ? "true" : "false");
    renderAssistantAccessState();
  });
});

renderAssistantAccessState();
