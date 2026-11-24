const STORAGE_KEY = "campusCountdownItems_v1";
const form = document.getElementById("itemForm");
const itemList = document.getElementById("itemList");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");
let items = loadItems();
let toastTimer;

function loadItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveItems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
function dateTime(item) {
  return new Date(`${item.date}T${item.time || "00:00"}:00`);
}
function countdownText(item) {
  const diff = dateTime(item).getTime() - Date.now();
  if (diff <= 0) return "Due date has arrived";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} left`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} left`;
  if (minutes < 1) return "Less than a minute left";
  return `${minutes} minute${minutes === 1 ? "" : "s"} left`;
}
function safe(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}
function render() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const status = document.getElementById("statusFilter").value;
  const visible = items.filter(item => {
    const matchesQuery = `${item.title} ${item.category} ${item.description || ""}`.toLowerCase().includes(query);
    return matchesQuery && (type === "All" || item.type === type) &&
      (status === "All" || (status === "Completed" ? item.completed : !item.completed));
  }).sort((a,b) => Number(a.completed) - Number(b.completed) || dateTime(a) - dateTime(b));

  itemList.innerHTML = visible.map(item => {
    const when = dateTime(item).toLocaleString([], { dateStyle:"medium", timeStyle:"short" });
    const countdown = item.completed ? "Successfully completed 🎉" : countdownText(item);
    const countdownClass = item.completed ? "done" : (dateTime(item) - Date.now() < 86400000 ? "soon" : "");
    return `<article class="item-card ${item.completed ? "completed" : ""}">
      <div>
        <div class="item-title-row"><span class="item-title">${safe(item.title)}</span><span class="type-chip">${safe(item.type)}</span><span class="category-chip">${safe(item.category)}</span></div>
        <div class="item-meta"><span>📅 ${safe(when)}</span></div>
        ${item.description ? `<p class="item-note">${safe(item.description)}</p>` : ""}
        <div class="countdown ${countdownClass}">${countdown}</div>
      </div>
      <div class="item-actions">
        ${item.completed ? `<button class="small-btn" data-action="reopen" data-id="${item.id}">↶ Reopen</button>` : `<button class="small-btn complete-btn" data-action="complete" data-id="${item.id}">✓ Complete</button>`}
        <button class="small-btn delete-btn" data-action="delete" data-id="${item.id}">Delete</button>
      </div>
    </article>`;
  }).join("");

  emptyState.classList.toggle("show", visible.length === 0);
  if (visible.length === 0) {
    const hasItems = items.length > 0;
    emptyState.querySelector("h3").textContent = hasItems ? "No matching items" : "Your schedule starts here";
    emptyState.querySelector("p").textContent = hasItems ? "Try changing your search or filters." : "Add an event or task to see its countdown.";
  }
  document.getElementById("visibleCount").textContent = `${visible.length} item${visible.length === 1 ? "" : "s"}`;
  document.getElementById("totalCount").textContent = items.length;
  document.getElementById("upcomingCount").textContent = items.filter(i => !i.completed).length;
  document.getElementById("completedCount").textContent = items.filter(i => i.completed).length;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const item = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
    title: data.get("title").trim(),
    type: data.get("type"),
    category: data.get("category"),
    date: data.get("date"),
    time: data.get("time") || "09:00",
    description: data.get("description").trim(),
    completed: false
  };
  if (!item.title || !item.date) return;
  items.push(item);
  saveItems();
  form.reset();
  document.getElementById("time").value = "09:00";
  render();
  showToast(`${item.type} added. One step closer to your goals! 🌟`);
});

itemList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = items.find(entry => entry.id === button.dataset.id);
  if (!item) return;

  if (button.dataset.action === "complete") {
    const confirmed = window.confirm(`Is this ${item.type.toLowerCase()} completed?\n\nChoose OK for Yes, or Cancel for Not yet.`);
    if (!confirmed) {
      showToast("No problem! Keep going — you can complete it when you're ready. 💪");
      return;
    }
    item.completed = true;
    item.completedAt = new Date().toISOString();
    saveItems();
    render();
    showToast(item.type === "Event"
      ? "Amazing! You showed up and made it happen. Keep creating great memories! 🎉"
      : "Brilliant work! Every task you finish is progress. Be proud of yourself! 🌟");
  } else if (button.dataset.action === "reopen") {
    item.completed = false;
    delete item.completedAt;
    saveItems();
    render();
    showToast("Moved back to upcoming. You’ve got this! 💪");
  } else if (button.dataset.action === "delete") {
    if (!window.confirm(`Delete this ${item.type.toLowerCase()} "${item.title}"?`)) return;
    items = items.filter(entry => entry.id !== item.id);
    saveItems();
    render();
    showToast("Item deleted.");
  }
});

["searchInput", "typeFilter", "statusFilter"].forEach(id => {
  document.getElementById(id).addEventListener(id === "searchInput" ? "input" : "change", render);
});

const dateInput = document.getElementById("date");
const today = new Date();
dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
render();
setInterval(render, 60000);
