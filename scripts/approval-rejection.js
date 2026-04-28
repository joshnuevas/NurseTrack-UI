const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const form = document.querySelector("#decision-form");
const message = document.querySelector("#form-message");
const decisionBadge = document.querySelector("#decision-badge");
const decisionCards = Array.from(document.querySelectorAll(".decision-card"));
const decisionInputs = Array.from(document.querySelectorAll("input[name='decision']"));
const reasonSelect = document.querySelector("#decision-reason");
const decisionLabels = {
  approved: "Verified",
  rejected: "Unverified",
  pending: "Pending",
  notApplicable: "Not Applicable"
};

function setMessage(text, state) {
  message.textContent = text;
  message.classList.remove("is-error", "is-success");

  if (state) {
    message.classList.add(state);
  }
}

function selectedDecision() {
  return decisionInputs.find((input) => input.checked)?.value || "approved";
}

function updateDecisionUI() {
  const decision = selectedDecision();

  decisionCards.forEach((card) => {
    const input = card.querySelector("input");
    card.classList.toggle("is-selected", input.checked);
  });

  decisionBadge.textContent = decisionLabels[decision] || "Pending";
  decisionBadge.classList.toggle("status-verified", decision === "approved");
  decisionBadge.classList.toggle("status-rejected", decision === "rejected");
  decisionBadge.classList.toggle("status-pending", decision === "pending" || decision === "notApplicable");
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

decisionInputs.forEach((input) => {
  input.addEventListener("change", updateDecisionUI);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const decision = selectedDecision();

  if ((decision === "rejected" || decision === "notApplicable" || decision === "pending") && !reasonSelect.value) {
    setMessage("Select a reason before submitting this validation status.", "is-error");
    reasonSelect.focus();
    return;
  }

  const messages = {
    approved: "Submission verified successfully.",
    rejected: "Submission marked unverified and returned to student.",
    pending: "Submission remains pending with reviewer remarks.",
    notApplicable: "Submission marked not applicable and retained in history."
  };

  setMessage(messages[decision] || "Validation status updated.", "is-success");
});

updateDecisionUI();
