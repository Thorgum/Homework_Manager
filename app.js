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
    var task = {
        mainTask: mainTask,
        dueDate: dueDate,
        subTasks: []
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
}

function addSubTask(taskIndex) {
    var subTask = document.getElementById('subTask_' + taskIndex).value;
    var subTaskDate = document.getElementById('subTaskDate_' + taskIndex).value;
    var subTaskObj = {
        subTask: subTask,
        subTaskDate: subTaskDate
    };

    tasks[taskIndex].subTasks.push(subTaskObj);
    saveTasks();
    renderTasks();
}

function removeMainTask(taskIndex) {
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();
}

function removeSubTask(taskIndex, subtaskIndex) {
    tasks[taskIndex].subTasks.splice(subtaskIndex, 1);
    saveTasks();
    renderTasks();
}

function disableDates(subTaskID) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    console.log(today);
    document.getElementById(subTaskID).setAttribute("min", today);
    document.getElementById(subTaskID).setAttribute("max", today);
}

function renderTasks() {
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

        var countdown = getCountdown(task.dueDate);
        var progressPercentage = getProgressPercentage(task.dueDate);

        taskContainer.innerHTML = `
            <div class="mainTaskOutput">Main Task: ${task.mainTask}, Due Date: ${task.dueDate}, Time Remaining: ${countdown} days left</div>
            <div class="progressBarContainer">
                <div class="progressBar" style="width: ${progressPercentage}%"></div>
            </div>
            <button class="mainTaskRemoveButton" onclick="removeMainTask(${taskIndex})">Remove</button>
            <div id="subTaskSection_${taskIndex}" class="subTaskSection">
                <label><b>Sub Task</b></label>
                <input type="text" name="subtask" id="subTask_${taskIndex}">
                <input type="date" name="subtaskDate" id="subTaskDate_${taskIndex}" onfocus=disableDates("subTaskDate_${taskIndex}")>
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
    var countdown = Math.ceil((due.getTime() - today.getTime()) / oneDay);
    return countdown;
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
