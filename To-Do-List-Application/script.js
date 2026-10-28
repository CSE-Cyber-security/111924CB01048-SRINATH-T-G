const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [
  { id: 1, text: "Complete assignment", completed: false },
  { id: 2, text: "Read a book", completed: true },
  { id: 3, text: "Attend class", completed: false },
  { id: 4, text: "Workout", completed: true },
  { id: 5, text: "Prepare for exam", completed: false }
];
let currentFilter = "all";
let nextId = 6;

function renderTasks() {
  taskList.innerHTML = "";
  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.completed ? "pending" : "completed"}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "icon-button complete-button";
    completeButton.textContent = task.completed ? "↶" : "✓";
    completeButton.title = task.completed ? "Mark as pending" : "Mark as completed";
    completeButton.setAttribute("aria-label", completeButton.title);
    completeButton.addEventListener("click", () => toggleTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "icon-button delete-button";
    deleteButton.textContent = "▤";
    deleteButton.title = "Delete task";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(completeButton, deleteButton);
    item.append(checkbox, text, actions);
    taskList.appendChild(item);
  });

  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  document.getElementById("all-count").textContent = tasks.length;
  document.getElementById("pending-count").textContent = pending;
  document.getElementById("completed-count").textContent = completed;
  document.getElementById("summary-pending").textContent = `${pending} pending`;
  document.getElementById("summary-completed").textContent = `${completed} completed`;
  emptyState.style.display = visibleTasks.length === 0 ? "block" : "none";
}

function addTask(text) {
  tasks.push({ id: nextId++, text, completed: false });
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) {
    input.focus();
    return;
  }
  addTask(taskText);
  input.value = "";
  input.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

renderTasks();
