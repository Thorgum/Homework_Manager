document.addEventListener("DOMContentLoaded", function() {
    renderTasks();
});

function addMainTask() {
    var mainTask = document.getElementById('mainTask').value;
    var dueDate = document.getElementById('dueDate').value;

    var task = {
        mainTask: mainTask,
        dueDate: dueDate,
        subTasks: []
    };

    addCookie("task_" + getCookie("taskCount"), JSON.stringify(task));
    incrementCookie("taskCount");
    renderTasks();
}

function addSubTask(taskIndex) {
    var subTask = document.getElementById('subTask_' + taskIndex).value;
    var subTaskDate = document.getElementById('subTaskDate_' + taskIndex).value;

    var subTaskObj = {
        subTask: subTask,
        subTaskDate: subTaskDate
    };

    addCookie("subTask_" + taskIndex + "_" + getCookie("subTaskCount_" + taskIndex), JSON.stringify(subTaskObj));
    incrementCookie("subTaskCount_" + taskIndex);
    renderTasks();
}

function displayMainTask(task, taskIndex) {
    var taskListContainer = document.getElementById('taskListContainer');

    var taskContainer = document.createElement('div');
    taskContainer.id = 'taskContainer_' + taskIndex;
    taskContainer.className = 'taskContainer';

    var countdown = getCountdown(task.dueDate);

    taskContainer.innerHTML = `
        <div class="mainTaskOutput">Main Task: ${task.mainTask}, Due Date: ${task.dueDate}, Time Remaining: ${countdown} days left</div>
        <button class="removeButton" onclick="removeMainTask(${taskIndex})">Remove</button>
        <div id="subTaskSection_${taskIndex}" class="subTaskSection">
            <label><b>Sub Task</b></label>
            <input type="text" name="subtask" id="subTask_${taskIndex}">
            <input type="date" name="subtaskDate" id="subTaskDate_${taskIndex}">
            <button id="addSubTaskButton_${taskIndex}" onclick="addSubTask(${taskIndex})">Add Sub Task</button>
        </div>
    `;

    taskListContainer.appendChild(taskContainer);
}

function displaySubtask(subTaskObj, taskIndex, subtaskIndex) {
    var subtasksList = document.getElementById('subTaskSection_' + taskIndex);
    var countdown = getCountdown(subTaskObj.subTaskDate);
    var subtaskContainer = document.createElement('ul');
    subtaskContainer.id = 'subTaskSection_' + taskIndex + '_' + subtaskIndex;
    subtaskContainer.className = 'subtasks';

    subtaskContainer.innerHTML = `
        <li>Sub Task: ${subTaskObj.subTask}, Due Date: ${subTaskObj.subTaskDate}, Time Remaining: ${countdown} days left
            <button class="removeButton" onclick="removeSubTask(${taskIndex}, ${subtaskIndex})">Remove</button>
        </li>
    `;

    subtasksList.appendChild(subtaskContainer);
}

function getCountdown(dueDate) {
    var today = new Date();
    var oneDay = 1000 * 60 * 60 * 24;
    var due = new Date(dueDate);
    var countdown = Math.ceil((due.getTime() - today.getTime()) / oneDay);
    return countdown;
}

function removeMainTask(taskIndex) {
    deleteCookie("task_" + taskIndex);

    // Remove the task element from the DOM
    var taskContainer = document.getElementById('taskContainer_' + taskIndex);
    if (taskContainer) {
        taskContainer.remove();
    }

    renderTasks(); // Render tasks after removal
}

function removeSubTask(taskIndex, subtaskIndex) {
    deleteCookie("subTask_" + taskIndex + "_" + subtaskIndex);

    // Remove the subtask element from the DOM
    var subtaskList = document.getElementById('subTaskSection_' + taskIndex + '_' + subtaskIndex);
    if (subtaskList) {
        subtaskList.remove();
    }

    renderTasks(); // Render tasks after removal
}

function renderTasks() {
    var taskListContainer = document.getElementById('taskListContainer');
    taskListContainer.innerHTML = '';

    var tasks = [];
    var taskCount = getCookie("taskCount");
    for (var i = 0; i < taskCount; i++) {
        var task = getCookie("task_" + i);
        if (task) {
            tasks.push(JSON.parse(task));
        }
    }

    // Sort tasks based on countdown value
    tasks.sort(function(a, b) {
        var countdownA = getCountdown(a.dueDate);
        var countdownB = getCountdown(b.dueDate);
        return countdownA - countdownB;
    });

    for (var j = 0; j < tasks.length; j++) {
        displayMainTask(tasks[j], j);

        // Collect subtasks of the current task
        var subtasks = [];
        var subTaskCount = getCookie("subTaskCount_" + j);
        for (var k = 0; k < subTaskCount; k++) {
            var subTask = getCookie("subTask_" + j + "_" + k);
            if (subTask) {
                subtasks.push(JSON.parse(subTask));
            }
        }

        // Sort subtasks based on countdown value
        subtasks.sort(function(a, b) {
            var countdownA = getCountdown(a.subTaskDate);
            var countdownB = getCountdown(b.subTaskDate);
            return countdownA - countdownB;
        });

        // Display sorted subtasks
        for (var l = 0; l < subtasks.length; l++) {
            displaySubtask(subtasks[l], j, l);
        }
    }
}


function addCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/";
}

function getCookie(name) {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookiePair = cookies[i].split("=");
        if (name === cookiePair[0]) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function incrementCookie(name) {
    var value = parseInt(getCookie(name)) || 0;
    addCookie(name, value + 1);
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function deleteAllData() {
    // Clear all cookies
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookiePair = cookies[i].split("=");
        document.cookie = cookiePair[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Refresh the page to clear the rendered tasks
    location.reload();
}
