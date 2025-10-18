let tasksDb = [];

const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const filterSelect = document.getElementById('filterButton');
const todoList = document.getElementById('todoList');
const addBtn = document.getElementById('addTaskButton');
const deleteAllBtn = document.getElementById('deleteAllButton');

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function validateInput(task, date) {
  if (task.trim() === '' || date.trim() === '') {
    alert('Please enter both task and due date!');
    return false;
  }

  if (task.trim().length < 3) {
    alert('Task must be at least 3 characters!');
    return false;
  }

  return true;
}

function addTask() {
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (!validateInput(task, date)) return;

  const newTask = {
    task: task,
    date: date,
    completed: false,
  };

  tasksDb.push(newTask);
  renderTasks();
  taskInput.focus();
}

function renderTasks() {
  const filter = filterSelect.value;
  let filteredTasks = tasksDb;

  if (filter === 'pending') {
    filteredTasks = tasksDb.filter((task) => !task.completed);
  } else if (filter === 'completed') {
    filteredTasks = tasksDb.filter((task) => task.completed);
  }

  todoList.innerHTML = '';
  if (filteredTasks.length === 0) {
    todoList.innerHTML = '<tr><td colspan="4" style="text-align:center;">No task found</td></tr>';
    return;
  }

  filteredTasks.forEach((task) => {
    const actualIndex = tasksDb.findIndex((t) => t === task);
    const row = document.createElement('tr');

    row.innerHTML = `
      <td class="${task.completed ? 'status-done' : ''}">${task.task}</td>
      <td>${formatDate(task.date)}</td>
      <td>${task.completed ? 'Done' : 'Pending'}</td>
      <td>
        <input 
          type="checkbox" 
          class="btn-checkbox" 
          ${task.completed ? 'checked' : ''}
          onchange="toggleComplete(${actualIndex})"
        >
        <button class="action-btn delete-btn" onclick="deleteTask(${actualIndex})">Delete</button>
      </td>
    `;

    todoList.appendChild(row);
  });
}

function toggleComplete(index) {
  tasksDb[index].completed = !tasksDb[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasksDb.splice(index, 1);
  renderTasks();
}

function deleteAllTasks() {
  if (tasksDb.length === 0) {
    alert('No tasks to delete!');
    return;
  }

  if (confirm('Are you sure to delete all tasks?')) {
    tasksDb = [];
    filterSelect.value = 'all';
    renderTasks();
  }
}

addBtn.addEventListener('click', addTask);
deleteAllBtn.addEventListener('click', deleteAllTasks);
filterSelect.addEventListener('change', renderTasks);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});
