document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
    renderTasks();
});

// Define arrays to hold tasks and subtasks
var tasks = [];

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    var storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

function addMainTask() {
    var mainTask = document.getElementById('mainTask').value;
    var dueDate = document.getElementById('dueDate').value;
    var taskColor = document.getElementById('taskColor').value || "#ffffff"; // Default color to white if not specified

    // Check if the due date is provided and valid
    if (!dueDate) {
        alert("Please select a due date.");
        return;
    }

    var today = new Date().toISOString().split('T')[0];
    if (dueDate < today) {
        alert("Due date cannot be in the past.");
        return;
    }

    var task = {
        mainTask: mainTask,
        dueDate: dueDate,
        taskColor: taskColor,
        subTasks: []
    };

    tasks.push(task); // Add to JSON file
    saveTasks();
    renderTasks();
}

function addSubTask(taskIndex) {
    var subTask = document.getElementById('subTask_' + taskIndex).value;
    var subTaskDate = document.getElementById('subTaskDate_' + taskIndex).value;
    var mainTaskDueDate = tasks[taskIndex].dueDate;

    // Check if the subtask date is provided and valid
    if (!subTaskDate) {
        alert("Please select a due date for the subtask.");
        return;
    }

    var today = new Date().toISOString().split('T')[0];
    if (subTaskDate < today) {
        alert("Subtask date cannot be in the past.");
        return;
    }

    if (subTaskDate > mainTaskDueDate) {
        alert("Subtask date cannot be later than the main task's due date.");
        return;
    }

    var subTaskObj = {
        subTask: subTask,
        subTaskDate: subTaskDate
    };

    tasks[taskIndex].subTasks.push(subTaskObj); // Add to JSON file
    saveTasks();
    renderTasks();
}

function removeMainTask(taskIndex) {
    tasks.splice(taskIndex, 1); // Removes the specific allocation for that task index
    saveTasks();
    renderTasks();
}

function removeSubTask(taskIndex, subtaskIndex) {
    tasks[taskIndex].subTasks.splice(subtaskIndex, 1); // Removes the specific allocation for that task index and subtask index
    saveTasks();
    renderTasks();
}

function disableDates(subTaskID, taskIndex) {
    var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    var mainTaskDueDate = tasks[taskIndex].dueDate;

    var subTaskDateInput = document.getElementById(subTaskID);
    subTaskDateInput.setAttribute("min", today);

    if (mainTaskDueDate) {
        subTaskDateInput.setAttribute("max", mainTaskDueDate);
    }
}

function disableTaskDates(TaskID) {
    var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    var subTaskDateInput = document.getElementById(TaskID);
    subTaskDateInput.setAttribute("min", today);
}

function renderTasks() {  // Display the info within the file tasks
    var taskListContainer = document.getElementById('taskListContainer');
    taskListContainer.innerHTML = '';
    taskListContainer.classList.add('taskListContainer');

    tasks.sort(function(a, b) {
        var countdownA = getCountdown(a.dueDate);
        var countdownB = getCountdown(b.dueDate);
        return countdownA - countdownB;
    });

    tasks.forEach(function(task, taskIndex) {
        var taskContainer = document.createElement('div');
        taskContainer.className = 'taskContainer';
        taskContainer.style.backgroundColor = task.taskColor; // Apply the selected color

        // Set text color to white if the background color is not white
        taskContainer.style.color = task.taskColor && task.taskColor.toLowerCase() !== "#ffffff" ? "white" : "black";

        var countdown = getCountdown(task.dueDate);
        var progressPercentage = getProgressPercentage(task.dueDate);
        // Adds a new display for each main task
        taskContainer.innerHTML = `
            <div class="mainTaskOutput">Main Task: ${task.mainTask}, Due Date: ${task.dueDate}, Time Remaining: ${countdown} days left</div>
            <div class="progressBarContainer">
                <div class="progressBar" style="width: ${progressPercentage}%"></div>
            </div>
            <button class="mainTaskRemoveButton" onclick="removeMainTask(${taskIndex})">Remove</button>
            <div id="subTaskSection_${taskIndex}" class="subTaskSection">
                <label><b>Sub Task</b></label>
                <input type="text" name="subtask" id="subTask_${taskIndex}">
                <input type="date" name="subtaskDate" id="subTaskDate_${taskIndex}" onfocus="disableDates('subTaskDate_${taskIndex}', ${taskIndex})">
                <button id="addSubTaskButton_${taskIndex}" onclick="addSubTask(${taskIndex})">Add Sub Task</button>
            </div>
        `;

        taskListContainer.appendChild(taskContainer);

        var subtasksList = document.getElementById('subTaskSection_' + taskIndex);

        task.subTasks.sort(function(a, b) {
            var countdownA = getCountdown(a.subTaskDate);
            var countdownB = getCountdown(b.subTaskDate);
            return countdownA - countdownB;
        });

        task.subTasks.forEach(function(subTaskObj, subtaskIndex) {
            var subtaskContainer = document.createElement('ul');
            subtaskContainer.className = 'subtasks';

            var countdown = getCountdown(subTaskObj.subTaskDate);
            var progressPercentage = getProgressPercentage(subTaskObj.subTaskDate);
            // Adds a new display for each subtask
            subtaskContainer.innerHTML = `
                <li>Sub Task: ${subTaskObj.subTask}, Due Date: ${subTaskObj.subTaskDate}, Time Remaining: ${countdown} days left
                    <div class="progressBarContainer">
                        <div class="progressBar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <button class="removeButton" onclick="removeSubTask(${taskIndex}, ${subtaskIndex})">Remove</button>
                </li>
            `;

            subtasksList.appendChild(subtaskContainer);
        });
    });
}

function getCountdown(dueDate) {
    var today = new Date();
    var oneDay = 1000 * 60 * 60 * 24;
    var due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / oneDay);
}

function getProgressPercentage(dueDate) {
    var today = new Date();
    var due = new Date(dueDate);
    var totalDays = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    var daysPassed = (today.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24);
    var progress = Math.min((daysPassed / totalDays) * 100, 100);
    return Math.max(progress, 0);
}

function deleteAllData() {
    if (confirm("Are you sure you want to delete all data?")) {
        tasks = [];
        localStorage.removeItem('tasks');
        renderTasks();
    }
}
