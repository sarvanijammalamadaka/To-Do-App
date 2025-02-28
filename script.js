// The main data structure for tasks.
// Each task is an object with text and an optional array for child tasks.
let tasks = [];

/**
 * Adds a new top-level task.
 */
function addTask() {
  const input = document.getElementById("mainTaskInput");
  const taskText = input.value.trim();
  if (!taskText) {
    alert("Please enter a task!");
    return;
  }
  tasks.push({ text: taskText, children: [] });
  input.value = "";
  renderTasks();
}

/**
 * Recursively render tasks and their child tasks.
 * @param {Array} taskArray - Array of tasks to render.
 * @param {HTMLElement} container - The container element to append tasks to.
 * @param {string} parentPath - The path (like "0", "0-1") of the parent tasks.
 */
function renderTaskList(taskArray, container, parentPath = "") {
  container.innerHTML = "";
  taskArray.forEach((task, index) => {
    // Create a unique path to reference this task in the structure
    const currentPath = parentPath === "" ? `${index}` : `${parentPath}-${index}`;

    // Create list item for the task.
    const li = document.createElement("li");
    li.className = "list-group-item";
    
    // Inner HTML with task text and action buttons.
    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span>${task.text}</span>
        <div>
          <button class="btn btn-warning btn-sm me-2" onclick="editTask('${currentPath}')">Edit</button>
          <button class="btn btn-danger btn-sm me-2" onclick="deleteTask('${currentPath}')">Delete</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleChildInput('${currentPath}')">+ Child</button>
        </div>
      </div>
      <div class="input-group my-2 d-none" id="childInputContainer-${currentPath}">
        <input type="text" id="childInput-${currentPath}" class="form-control" placeholder="Add child task">
        <button class="btn btn-secondary" onclick="addChildTask('${currentPath}')">Add</button>
      </div>
      <ul id="childList-${currentPath}" class="list-group nested-task-list"></ul>
    `;
    container.appendChild(li);

    // Render any child tasks if they exist.
    if (task.children && task.children.length > 0) {
      const childListEl = li.querySelector(`#childList-${currentPath}`);
      renderTaskList(task.children, childListEl, currentPath);
    }
  });
}

/**
 * Renders all top-level tasks.
 */
function renderTasks() {
  const taskListEl = document.getElementById("taskList");
  renderTaskList(tasks, taskListEl);
}

/**
 * Toggle the child task input for a given task.
 * @param {string} path - The unique path of the task.
 */
function toggleChildInput(path) {
  const container = document.getElementById(`childInputContainer-${path}`);
  if (container.classList.contains("d-none")) {
    container.classList.remove("d-none");
  } else {
    container.classList.add("d-none");
  }
}

/**
 * Adds a child task to an existing task.
 * @param {string} path - The unique path identifying the parent task.
 */
function addChildTask(path) {
  const input = document.getElementById(`childInput-${path}`);
  const childText = input.value.trim();
  if (!childText) {
    alert("Please enter a child task!");
    return;
  }
  
  // Find the parent task using the path.
  const taskRef = getTaskByPath(path);
  taskRef.children.push({ text: childText, children: [] });
  input.value = "";
  renderTasks();
}

/**
 * Edits a task identified by its unique path.
 * @param {string} path - The unique path identifying the task.
 */
function editTask(path) {
  const taskRef = getTaskByPath(path);
  const newText = prompt("Edit task:", taskRef.text);
  if (newText && newText.trim() !== "") {
    taskRef.text = newText.trim();
    renderTasks();
  }
}

/**
 * Deletes a task identified by its unique path.
 * @param {string} path - The unique path identifying the task.
 */
function deleteTask(path) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  const { parentArray, index } = getParentArrayAndIndex(path);
  parentArray.splice(index, 1);
  renderTasks();
}

/**
 * Retrieves a task object given its unique path.
 * @param {string} path - e.g., "0-1-2"
 * @returns {object} The task object.
 */
function getTaskByPath(path) {
  const indices = path.split("-").map(Number);
  let taskRef = tasks[indices[0]];
  for (let i = 1; i < indices.length; i++) {
    taskRef = taskRef.children[indices[i]];
  }
  return taskRef;
}

/**
 * Retrieves the parent array and the index of the task to modify.
 * @param {string} path - e.g., "0-1-2"
 * @returns {object} An object containing the parent array and the index.
 */
function getParentArrayAndIndex(path) {
  const indices = path.split("-").map(Number);
  const targetIndex = indices.pop();
  let parentArray = tasks;
  indices.forEach(i => {
    parentArray = parentArray[i].children;
  });
  return { parentArray, index: targetIndex };
}
