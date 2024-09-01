// Event listener that triggers once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    loadTasks(); // Load tasks from local storage when the page loads
    renderTasks(); // Render tasks on the page
});

// Define an array to hold the tasks, including their subtasks
var tasks = [];

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Convert tasks array to a JSON string and save it in local storage
}

// Function to load tasks from local storage
function loadTasks() {
    var storedTasks = localStorage.getItem('tasks'); // Retrieve the tasks string from local storage
    if (storedTasks) {
        tasks = JSON.parse(storedTasks); // Parse the JSON string back into the tasks array
    }
}

// Function to add a main task
function addMainTask() {
    var mainTask = document.getElementById('mainTask').value;
    var dueDate = document.getElementById('dueDate').value;
    var taskColor = document.getElementById('taskColor').value || "#ffffff"; // Get the color for the task or default to white if none is selected

    // Check if the due date is provided and valid
    if (!dueDate) {
        alert("Please select a due date."); // Alert the user if no due date is selected
        return;
    }

    var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    if (dueDate < today) {
        alert("Due date cannot be in the past."); // Alert the user if the due date is in the past
        return;
    }

    // Create a task object with its properties
    var task = {
        mainTask: mainTask,
        dueDate: dueDate,
        taskColor: taskColor,
        subTasks: [] // Initialize an empty array for subtasks
    };

    tasks.push(task); // Add the new task to the tasks array
    saveTasks();
    renderTasks(); // Re-render the task list to include the new task
}

// Function to add a subtask to a specific main task
function addSubTask(taskIndex) {
    var subTask = document.getElementById('subTask_' + taskIndex).value;
    var subTaskDate = document.getElementById('subTaskDate_' + taskIndex).value;
    var mainTaskDueDate = tasks[taskIndex].dueDate; // Get the main task's due date for validation

    // Check if the subtask date is provided and valid
    if (!subTaskDate) {
        alert("Please select a due date for the subtask."); // Alert the user if no subtask date is selected
        return;
    }

    var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    if (subTaskDate < today) {
        alert("Subtask date cannot be in the past."); // Alert the user if the subtask date is in the past
        return;
    }

    if (subTaskDate > mainTaskDueDate) {
        alert("Subtask date cannot be later than the main task's due date."); // Alert the user if the subtask date is after the main task's due date
        return;
    }

    // Create a subtask object with its properties
    var subTaskObj = {
        subTask: subTask,
        subTaskDate: subTaskDate
    };

    tasks[taskIndex].subTasks.push(subTaskObj); // Add the subtask to the specific main task
    saveTasks();
    renderTasks(); // Re-render the task list to include the new subtask
}

// Function to remove a main task based on its index
function removeMainTask(taskIndex) {
    tasks.splice(taskIndex, 1); // Remove the task from the tasks array
    saveTasks();
    renderTasks(); // Re-render the task list to reflect the removed task
}

// Function to remove a subtask from a specific main task
function removeSubTask(taskIndex, subtaskIndex) {
    tasks[taskIndex].subTasks.splice(subtaskIndex, 1); // Remove the subtask from the specified main task
    saveTasks();
    renderTasks(); // Re-render the task list to reflect the removed subtask
}

// Function to disable date input fields for subtasks to ensure valid date selection
function disableDates(subTaskID, taskIndex) {
    var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    var mainTaskDueDate = tasks[taskIndex].dueDate; // Get the main task's due date

    var subTaskDateInput = document.getElementById(subTaskID);
    subTaskDateInput.setAttribute("min", today); // Set the earliest selectable date to today

    if (mainTaskDueDate) {
        subTaskDateInput.setAttribute("max", mainTaskDueDate); // Set the latest selectable date to the main task's due date
    }
}

// Function to disable date input fields for main tasks to ensure valid date selection
function disableTaskDates(TaskID) {
    var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    var subTaskDateInput = document.getElementById(TaskID);
    subTaskDateInput.setAttribute("min", today); // Set the earliest selectable date to today
}

// Function to render all tasks and subtasks to the page
function renderTasks() {
    var taskListContainer = document.getElementById('taskListContainer');
    taskListContainer.innerHTML = ''; // Clear the task list container
    taskListContainer.classList.add('taskListContainer'); // Add the task list container class for styling

    // Sort tasks by their countdown (time remaining until due date)
    tasks.sort(function(a, b) {
        var countdownA = getCountdown(a.dueDate);
        var countdownB = getCountdown(b.dueDate);
        return countdownA - countdownB; // Sort tasks in ascending order of countdown
    });

    // Loop through each task and create HTML elements to display it
    tasks.forEach(function(task, taskIndex) {
        var taskContainer = document.createElement('div');
        taskContainer.className = 'taskContainer';
        taskContainer.style.backgroundColor = task.taskColor; // Apply the selected background color

        // Set the text color to white if the background color is not white
        taskContainer.style.color = task.taskColor && task.taskColor.toLowerCase() !== "#ffffff" ? "white" : "black";

        var countdown = getCountdown(task.dueDate);
        var progressPercentage = getProgressPercentage(task.dueDate);

        // HTML content for each main task, including its countdown, progress bar, and subtask input
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

        taskListContainer.appendChild(taskContainer); // Add the task container to the task list

        var subtasksList = document.getElementById('subTaskSection_' + taskIndex);

        // Sort subtasks by their countdown (time remaining until due date)
        task.subTasks.sort(function(a, b) {
            var countdownA = getCountdown(a.subTaskDate);
            var countdownB = getCountdown(b.subTaskDate);
            return countdownA - countdownB; // Sort subtasks in ascending order of countdown
        });

        // Loop through each subtask and create HTML elements to display it
        task.subTasks.forEach(function(subTaskObj, subtaskIndex) {
            var subtaskContainer = document.createElement('ul');
            subtaskContainer.className = 'subtasks';

            var countdown = getCountdown(subTaskObj.subTaskDate);
            var progressPercentage = getProgressPercentage(subTaskObj.subTaskDate);

            // HTML content for each subtask, including its countdown, progress bar, and remove button
            subtaskContainer.innerHTML = `
                <li>
                    Subtask: ${subTaskObj.subTask}, Due Date: ${subTaskObj.subTaskDate}, Time Remaining: ${countdown} days left
                    <div class="progressBarContainer">
                        <div class="progressBar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <button class="subTaskRemoveButton" onclick="removeSubTask(${taskIndex}, ${subtaskIndex})">Remove</button>
                </li>
            `;

            subtasksList.appendChild(subtaskContainer); // Add the subtask container to the subtask list
        });
    });
}

// Function to calculate the countdown (time remaining) until a due date
function getCountdown(dueDate) {
    var dueDateObj = new Date(dueDate);
    var currentDate = new Date();
    var timeDiff = dueDateObj - currentDate; // Calculate the difference in milliseconds
    var daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysRemaining;
}

// Function to calculate the progress percentage based on the time remaining until a due date
function getProgressPercentage(dueDate) {
    var dueDateObj = new Date(dueDate);
    var currentDate = new Date();
    var totalTime = dueDateObj - currentDate; // Calculate the total time remaining in milliseconds
    var timeElapsed = dueDateObj.getTime() - currentDate.getTime(); // Calculate the time elapsed in milliseconds

    // Calculate the progress percentage based on the time elapsed and total time
    var progressPercentage = 100 - ((totalTime / timeElapsed) * 100);
    return Math.min(Math.max(progressPercentage, 0), 100); // Ensure the percentage is between 0 and 100
}
