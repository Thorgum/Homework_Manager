document.addEventListener("DOMContentLoaded", function() {
    // Clear local storage if Load button wasn't pressed
    if (!localStorage.getItem('loadClicked')) {
        localStorage.removeItem('mainTask');
        localStorage.removeItem('dueDate');
        localStorage.removeItem('subtasks');
    }
});

function loadData() {
    // Set flag indicating Load button was clicked
    localStorage.setItem('loadClicked', true);

    // Retrieve main task and subtasks from local storage
    var mainTask = localStorage.getItem('mainTask');
    var dueDate = localStorage.getItem('dueDate');
    var subtasks = localStorage.getItem('subtasks');

    // Display main task and subtasks
    if (mainTask && dueDate) {
        displayMainTask(mainTask, dueDate);
    }
    if (subtasks) {
        displaySubtasks(subtasks);
    }

    // Show relevant sections
    document.getElementById('subTaskSection').style.display = 'block';
    document.getElementById('output').style.display = 'block';
    document.getElementById('mainTaskSection').style.display = 'none';
    document.getElementById('subTaskSection').style.display = 'block'; // Ensure subtask section is shown
    document.getElementById('output').style.display = 'block'; // Ensure output section is shown
}

function addMainTask() {
    var mainTask = document.getElementById('mainTask').value;
    var dueDate = document.getElementById('dueDate').value;

    // Display main task
    displayMainTask(mainTask, dueDate);

    // Show subtask input section
    document.getElementById('subTaskSection').style.display = 'block';
    document.getElementById('output').style.display = 'block';

    // Hide main task input section
    document.getElementById('mainTaskSection').style.display = 'none';

    // Save main task to local storage
    localStorage.setItem('mainTask', mainTask);
    localStorage.setItem('dueDate', dueDate);
}

function addSubTask() {
    var subTask = document.getElementById('subTask').value;
    var subTaskDate = document.getElementById('subTaskDate').value;
    var subtasksList = document.getElementById('subtasks');

    // Add subtask to the list
    subtasksList.innerHTML += "<li>Sub Task: " + subTask + ", Date: " + subTaskDate + "</li>";

    // Save subtask to local storage
    var subtasks = localStorage.getItem('subtasks') || '';
    subtasks += "Sub Task: " + subTask + ", Date: " + subTaskDate + '\n';
    localStorage.setItem('subtasks', subtasks);
}

function displayMainTask(mainTask, dueDate) {
    var taskOutput = document.getElementById('taskOutput');
    taskOutput.innerHTML = "Main Task: " + mainTask + ", Due Date: " + dueDate;
}

function displaySubtasks(subtasks) {
    var subtasksList = document.getElementById('subtasks');
    subtasksList.innerHTML = ''; // Clear previous subtasks
    var subtasksArray = subtasks.split('\n');
    subtasksArray.forEach(function(subtask) {
        if (subtask.trim() !== '') {
            subtasksList.innerHTML += "<li>" + subtask + "</li>";
        }
    });
}
