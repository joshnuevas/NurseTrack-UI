const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const roleFilter = document.querySelector("#role-filter");
const statusFilter = document.querySelector("#status-filter");
const userSearch = document.querySelector("#user-search");
const userRows = Array.from(document.querySelectorAll(".user-row:not(.user-row-head)"));
const emptyState = document.querySelector("#user-empty");
const visibleCount = document.querySelector("#visible-user-count");
const userMessage = document.querySelector("#user-message");
const userForm = document.querySelector("#user-form");
const newUserMessage = document.querySelector("#new-user-message");
const userTable = document.querySelector("#user-table");
const newId = document.querySelector("#new-id");
const newName = document.querySelector("#new-name");
const newEmail = document.querySelector("#new-email");
const newRole = document.querySelector("#new-role");
const newSection = document.querySelector("#new-section");
const newIdLabel = newId.closest(".form-label");
const newIdError = newIdLabel.querySelector(".field-error");
const activeUserCount = document.querySelector("#active-user-count");
const pendingUserCount = document.querySelector("#pending-user-count");
const syncPill = document.querySelector("#user-sync-pill");

function statusText(row) {
  return row.dataset.status.charAt(0).toUpperCase() + row.dataset.status.slice(1);
}

function updateCounts() {
  const rows = Array.from(document.querySelectorAll(".user-row:not(.user-row-head)"));
  const active = rows.filter((row) => row.dataset.status === "active").length;
  const pending = rows.filter((row) => row.dataset.status === "pending").length;

  activeUserCount.textContent = active;
  pendingUserCount.textContent = pending;
  syncPill.textContent = `${active} active`;
}

function filterUsers() {
  const role = roleFilter.value;
  const status = statusFilter.value;
  const query = userSearch.value.trim().toLowerCase();
  const rows = Array.from(document.querySelectorAll(".user-row:not(.user-row-head)"));
  let shown = 0;

  rows.forEach((row) => {
    const matchesRole = role === "all" || row.dataset.role === role;
    const matchesStatus = status === "all" || row.dataset.status === status;
    const matchesQuery = !query || row.textContent.toLowerCase().includes(query);
    const isVisible = matchesRole && matchesStatus && matchesQuery;

    row.hidden = !isVisible;
    if (isVisible) {
      shown += 1;
    }
  });

  visibleCount.textContent = `${shown} visible`;
  emptyState.hidden = shown > 0;
}

function setRowStatus(row, status) {
  row.dataset.status = status;
  const badge = row.querySelector(".status-badge");
  const button = row.querySelector(".user-action");

  badge.textContent = statusText(row);
  badge.className = `status-badge ${status === "active" ? "status-verified" : status === "pending" ? "status-pending" : "status-rejected"}`;

  if (status === "active") {
    button.textContent = "Suspend";
    button.dataset.action = "suspend";
    button.className = "ghost-button user-action";
  } else if (status === "suspended") {
    button.textContent = "Restore";
    button.dataset.action = "restore";
    button.className = "primary-button user-action";
  }

  updateCounts();
  filterUsers();
}

function handleUserAction(button) {
  const row = button.closest(".user-row");
  const action = button.dataset.action;

  if (action === "approve" || action === "restore") {
    setRowStatus(row, "active");
    userMessage.textContent = `${row.querySelector("strong").textContent} is now active.`;
    userMessage.classList.add("is-success");
    return;
  }

  setRowStatus(row, "suspended");
  userMessage.textContent = `${row.querySelector("strong").textContent} has been suspended.`;
  userMessage.classList.add("is-success");
}

function validateNewId() {
  const isValid = /^\d{2}-\d{4}-\d{3}$/.test(newId.value.trim());
  newIdLabel.classList.toggle("has-error", !isValid);
  newId.setAttribute("aria-invalid", String(!isValid));
  newIdError.hidden = isValid;
  return isValid;
}

function roleValue(label) {
  if (label === "Clinical Instructor") {
    return "instructor";
  }

  if (label === "Admin / Manager") {
    return "admin";
  }

  return "student";
}

function addPendingUser() {
  const row = document.createElement("div");
  row.className = "user-row";
  row.dataset.role = roleValue(newRole.value);
  row.dataset.status = "pending";
  row.innerHTML = `
    <span>
      <strong>${newName.value.trim()}</strong>
      <small>${newEmail.value.trim()}</small>
    </span>
    <span>${newRole.value}</span>
    <span>
      <strong>${newId.value.trim()}</strong>
      <small>${newSection.value.trim()}</small>
    </span>
    <span><mark class="status-badge status-pending">Pending</mark></span>
    <span><button class="primary-button user-action" type="button" data-action="approve">Approve</button></span>
  `;

  userTable.append(row);
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

[roleFilter, statusFilter, userSearch].forEach((control) => {
  control.addEventListener("input", filterUsers);
});

userTable.addEventListener("click", (event) => {
  const button = event.target.closest(".user-action");

  if (button) {
    handleUserAction(button);
  }
});

newId.addEventListener("input", () => {
  if (newId.value.trim()) {
    validateNewId();
  }
});

userForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!userForm.checkValidity() || !validateNewId()) {
    newUserMessage.textContent = "Complete all fields and use the correct ID format.";
    newUserMessage.classList.remove("is-success");
    newUserMessage.classList.add("is-error");
    return;
  }

  addPendingUser();
  updateCounts();
  filterUsers();

  newUserMessage.textContent = "Account created successfully.";
  newUserMessage.classList.remove("is-error");
  newUserMessage.classList.add("is-success");
  userForm.reset();
  newIdLabel.classList.remove("has-error");
  newIdError.hidden = true;
});

updateCounts();
filterUsers();
