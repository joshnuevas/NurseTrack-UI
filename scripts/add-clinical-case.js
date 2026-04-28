const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const form = document.querySelector("#clinical-case-form");
const message = document.querySelector("#form-message");
const saveDraft = document.querySelector("#save-case-draft");

function setMessage(text, state) {
  message.textContent = text;
  message.classList.remove("is-error", "is-success");

  if (state) {
    message.classList.add(state);
  }
}

function hasRequiredFields(formData) {
  const fields = [
    "caseDate",
    "caseCategory",
    "caseSubcategory",
    "clinicalSite",
    "dutyArea",
    "caseCode",
    "clinicalInstructor",
    "procedureTitle"
  ];

  const hasBaseFields = fields.every((field) => String(formData.get(field) || "").trim());
  const isMajorCase = formData.get("caseSubcategory") === "Major cases";
  const hasMajorRole = !isMajorCase || formData.get("caseMajorRole") !== "Not applicable";

  return hasBaseFields && hasMajorRole;
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

saveDraft.addEventListener("click", () => {
  setMessage("Case draft saved.", "is-success");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  if (!hasRequiredFields(formData)) {
    setMessage("Please complete the DR/OR category, subcategory, and required case details.", "is-error");
    return;
  }

  setMessage("Case details saved. Opening checklist form.", "is-success");
  window.setTimeout(() => {
    window.location.href = "checklist-form.html";
  }, 650);
});
