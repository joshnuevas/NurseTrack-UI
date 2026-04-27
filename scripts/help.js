const menuButton = document.querySelector("[data-menu-button]");
const sidebarBackdrop = document.querySelector("[data-close-sidebar]");
const searchInput = document.querySelector("#help-search");
const searchMessage = document.querySelector("#help-search-message");
const visibleTopicCount = document.querySelector("#visible-topic-count");
const emptyState = document.querySelector("#help-empty");
const topicCards = Array.from(document.querySelectorAll(".help-topic-card"));
const faqItems = Array.from(document.querySelectorAll(".help-faq-item"));
const requestForm = document.querySelector("#help-request-form");
const requestMessage = document.querySelector("#request-message");
const syncPill = document.querySelector(".sync-pill");

function filterHelp() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleTopics = 0;
  let visibleFaqs = 0;

  topicCards.forEach((card) => {
    const matches = !query || card.textContent.toLowerCase().includes(query) || card.dataset.topic.includes(query);
    card.hidden = !matches;
    if (matches) {
      visibleTopics += 1;
    }
  });

  faqItems.forEach((item) => {
    const matches = !query || item.textContent.toLowerCase().includes(query) || item.dataset.topic.includes(query);
    item.hidden = !matches;
    if (matches) {
      visibleFaqs += 1;
    }
  });

  emptyState.hidden = visibleTopics > 0;
  visibleTopicCount.textContent = `${visibleTopics} visible`;
  syncPill.textContent = `${visibleTopics} topics`;
  searchMessage.textContent = query
    ? `Showing ${visibleTopics} topic${visibleTopics === 1 ? "" : "s"} and ${visibleFaqs} answer${visibleFaqs === 1 ? "" : "s"}.`
    : "Showing all help topics.";
}

menuButton.addEventListener("click", () => {
  document.body.classList.add("sidebar-open");
});

sidebarBackdrop.addEventListener("click", () => {
  document.body.classList.remove("sidebar-open");
});

searchInput.addEventListener("input", filterHelp);

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!requestForm.checkValidity()) {
    requestMessage.textContent = "Complete all fields before sending.";
    requestMessage.classList.remove("is-success");
    requestMessage.classList.add("is-error");
    return;
  }

  requestMessage.textContent = "Support request sent successfully.";
  requestMessage.classList.remove("is-error");
  requestMessage.classList.add("is-success");
  requestForm.reset();
});
