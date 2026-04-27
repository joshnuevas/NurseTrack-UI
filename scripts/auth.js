const loginForm = document.querySelector("#login-form");
const message = document.querySelector("#form-message");
const nextPageLinks = document.querySelectorAll("[data-next-page]");

function setMessage(text, state) {
  message.textContent = text;
  message.classList.remove("is-error", "is-success");

  if (state) {
    message.classList.add(state);
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const userId = String(formData.get("userId") || "").trim();
  const password = String(formData.get("password") || "");

  if (!userId || !password) {
    setMessage("Enter both school email or ID number and password to continue.", "is-error");
    return;
  }

  if (password.length < 8) {
    setMessage("Password must be at least 8 characters.", "is-error");
    return;
  }

  setMessage("Signed in successfully.", "is-success");
});

nextPageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const nextPage = link.dataset.nextPage;
    setMessage(`${nextPage} is not active on this screen yet.`, "");
  });
});
