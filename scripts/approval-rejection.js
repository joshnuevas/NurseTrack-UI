const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const form = document.querySelector("#decision-form");
const message = document.querySelector("#form-message");
const decisionBadge = document.querySelector("#decision-badge");
const decisionCards = Array.from(document.querySelectorAll(".decision-card"));
const decisionInputs = Array.from(document.querySelectorAll("input[name='decision']"));
const reasonSelect = document.querySelector("#decision-reason");

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

  decisionBadge.textContent = decision === "approved" ? "Approve" : "Reject";
  decisionBadge.classList.toggle("status-verified", decision === "approved");
  decisionBadge.classList.toggle("status-rejected", decision === "rejected");
  decisionBadge.classList.toggle("status-pending", false);
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

  if (decision === "rejected" && !reasonSelect.value) {
    setMessage("Select a rejection reason before submitting.", "is-error");
    reasonSelect.focus();
    return;
  }

  setMessage(decision === "approved" ? "Submission approved successfully." : "Submission rejected and returned to student.", "is-success");
});

updateDecisionUI();
