document.addEventListener("DOMContentLoaded", function() {
    renderTasks();
});

// Define arrays to hold tasks and subtasks
var tasks = [];
var subtasks = [];

function addMainTask() {
    var mainTask = document.getElementById('mainTask').value;
    var dueDate = document.getElementById('dueDate').value;

    var task = {
        mainTask: mainTask,
        dueDate: dueDate,
        subTasks: []
    };

    tasks.push(task);
    renderTasks();
}

function addSubTask(taskIndex) {
    var subTask = document.getElementById('subTask_' + taskIndex).value;
    var subTaskDate = document.getElementById('subTaskDate_' + taskIndex).value;

    var subTaskObj = { //defining record
        subTask: subTask,
        subTaskDate: subTaskDate
    };

    tasks[taskIndex].subTasks.push(subTaskObj);
    renderTasks();
}

function removeMainTask(taskIndex) {
    tasks.splice(taskIndex, 1); //deleting the one in the array in the taskindex position
    renderTasks();
}

function removeSubTask(taskIndex, subtaskIndex) {
    tasks[taskIndex].subTasks.splice(subtaskIndex, 1); //deleting the one in the array in the subtaskindex position
    renderTasks();
}

function renderTasks() {
    var taskListContainer = document.getElementById('taskListContainer');
    taskListContainer.innerHTML = '';
    taskListContainer.classList.add('taskListContainer');

    // Sort tasks based on countdown value
    tasks.sort(function(a, b) {  //sorting the tasks from lowest countdown to greatest
        var countdownA = getCountdown(a.dueDate);
        var countdownB = getCountdown(b.dueDate);
        return countdownA - countdownB;
    });

    tasks.forEach(function(task, taskIndex) {
        var taskContainer = document.createElement('div');
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

        var subtasksList = document.getElementById('subTaskSection_' + taskIndex);

        // Sort subtasks based on countdown value
        task.subTasks.sort(function(a, b) {
            var countdownA = getCountdown(a.subTaskDate);
            var countdownB = getCountdown(b.subTaskDate);
            return countdownA - countdownB;
        });

        task.subTasks.forEach(function(subTaskObj, subtaskIndex) {
            var subtaskContainer = document.createElement('ul');
            subtaskContainer.className = 'subtasks';

            var countdown = getCountdown(subTaskObj.subTaskDate);

            subtaskContainer.innerHTML = `
                <li>Sub Task: ${subTaskObj.subTask}, Due Date: ${subTaskObj.subTaskDate}, Time Remaining: ${countdown} days left
                    <button class="removeButton" onclick="removeSubTask(${taskIndex}, ${subtaskIndex})">Remove</button>
                </li>
            `;

            subtasksList.appendChild(subtaskContainer);
        });
    });
}


function getCountdown(dueDate) {
    var today = new Date();
    var oneDay = 1000 * 60 * 60 * 24; // seconds in one day
    var due = new Date(dueDate);
    var countdown = Math.ceil((due.getTime() - today.getTime()) / oneDay); // gettime() converts it to milliseconds since 1 January 1970
    return countdown;
}

function deleteAllData() {
    // Clear tasks and subtasks arrays
    tasks = [];
    subtasks = [];

    // Clear the task list container in the DOM
    var taskListContainer = document.getElementById('taskListContainer');
    taskListContainer.innerHTML = '';
    renderTasks();
}
