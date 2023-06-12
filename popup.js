document.addEventListener("DOMContentLoaded", function () {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const timeInput = document.getElementById("time-input");
  const todoList = document.getElementById("todo-list");
  const clearCompletedBtn = document.getElementById("clear-completed");
  const alertsContainer = document.getElementById("alerts");

  // Retrieve tasks from storage
  chrome.storage.sync.get("tasks", function (data) {
    const savedTasks = data.tasks || [];
    savedTasks.forEach(function (task) {
      addTaskToDOM(task.text, task.date, task.time, task.completed);
    });
  });

  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskText = todoInput.value.trim();
    const taskDate = dateInput.value.trim();
    const taskTime = timeInput.value.trim();

    if (taskText !== "") {
      const task = {
        text: taskText,
        date: taskDate,
        time: taskTime,
        completed: false
      };

      addTaskToDOM(taskText, taskDate, taskTime, false);
      saveTask(task);
      todoInput.value = "";
      dateInput.value = "";
      timeInput.value = "";
    }
  });

  function addTaskToDOM(text, date, time, completed) {
    const listItem = document.createElement("li");
    listItem.classList.add("todo-item");
    if (completed) {
      listItem.classList.add("completed");
    }

    const taskText = document.createElement("span");
    taskText.classList.add("todo-text");
    taskText.textContent = text;

    const taskDateTime = document.createElement("span");
    taskDateTime.classList.add("todo-datetime");
    taskDateTime.textContent = `${date} ${time}`;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("button-delete");
    deleteButton.textContent = "X";

    listItem.appendChild(taskText);
    listItem.appendChild(taskDateTime);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);

    // Add event listener to mark task as completed
    listItem.addEventListener("click", function (event) {
      if (event.target === deleteButton) {
        deleteTask(listItem);
      } else {
        listItem.classList.toggle("completed");
        const taskIndex = Array.from(todoList.children).indexOf(listItem);
        updateTaskStatus(taskIndex, !completed);
      }
    });
  }

  function saveTask(task) {
    chrome.storage.sync.get("tasks", function (data) {
      const savedTasks = data.tasks || [];
      savedTasks.push(task);
      chrome.storage.sync.set({ tasks: savedTasks });
    });
  }

  function updateTaskStatus(index, completed) {
    chrome.storage.sync.get("tasks", function (data) {
      const savedTasks = data.tasks || [];
      savedTasks[index].completed = completed;
      chrome.storage.sync.set({ tasks: savedTasks });
    });
  }

  function deleteTask(listItem) {
    const taskIndex = Array.from(todoList.children).indexOf(listItem);
    chrome.storage.sync.get("tasks", function (data) {
      const savedTasks = data.tasks || [];
      savedTasks.splice(taskIndex, 1);
      chrome.storage.sync.set({ tasks: savedTasks });
      listItem.remove();
    });
  }

  clearCompletedBtn.addEventListener("click", function () {
    chrome.storage.sync.get("tasks", function (data) {
      const savedTasks = data.tasks || [];
      const updatedTasks = savedTasks.filter(function (task) {
        return !task.completed;
      });
      chrome.storage.sync.set({ tasks: updatedTasks });
      todoList.innerHTML = "";
      updatedTasks.forEach(function (task) {
        addTaskToDOM(task.text, task.date, task.time, task.completed);
      });
    });
  });
   // Load Theme Preference
  // Retrieve theme preference from storage
  chrome.storage.sync.get("theme", function (data) {
    if (data.theme === "dark") {
      document.body.classList.add("dark-mode");
    }
  });
});