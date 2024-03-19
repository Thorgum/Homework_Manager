document.addEventListener("DOMContentLoaded", function() {
    // Retrieve loadClicked from local storage
    var loadClicked = localStorage.getItem('loadClicked');

    // Clear local storage if Load button wasn't pressed
    if (loadClicked !== 'true') {
        console.log("Load click false");
        localStorage.clear();
    }

    // Call loadData function
    loadData();
});

function loadData() {
    // Set flag indicating Load button was clicked
    localStorage.setItem('loadClicked', 'true');

    // Retrieve tasks from local storage
    var tasks = localStorage.getItem('tasks');

    // Display tasks
    if (tasks) {
        var tasksArray = tasks.split(';');
        tasksArray.forEach(function(taskString) {
            var taskParts = taskString.split(',');
            var mainTask = taskParts[0];
            var dueDate = taskParts[1];
            var subtasks = taskParts.slice(2).join(',');
            displayTask(mainTask, dueDate, subtasks);
        });
    }

    // Show relevant sections
    var mainTaskSection = document.getElementById('mainTaskSection');
    var subTaskButton = document.getElementById('addSubTaskButton');

    if (mainTaskSection.children.length > 0) {
        subTaskButton.style.display = 'block';
    } else {
        subTaskButton.style.display = 'none';
    }

    document.getElementById('subTaskSection').style.display = 'block';
    document.getElementById('output').style.display = 'block';
    document.getElementById('mainTaskSection').style.display = 'block'; // Make sure mainTaskSection is visible
}

function addMainTask() {
    var mainTask = document.getElementById('mainTask').value;
    var dueDate = document.getElementById('dueDate').value;

    // Display main task
    displayTask(mainTask, dueDate);

    // Show subtask input section
    document.getElementById('subTaskSection').style.display = 'block';
    document.getElementById('output').style.display = 'block';

    // Hide main task input section
    document.getElementById('mainTaskSection').style.display = 'none';

    // Save main task to local storage
    var tasks = localStorage.getItem('tasks') || '';
    tasks += mainTask + ',' + dueDate + ';';
    localStorage.setItem('tasks', tasks);
}

function addSubTask() {
    var subTask = document.getElementById('subTask').value;
    var subTaskDate = document.getElementById('subTaskDate').value;
    var subtasksList = document.getElementById('subtasks');

    // Add subtask to the list
    subtasksList.innerHTML += "<li>Sub Task: " + subTask + ", Due: " + subTaskDate + "</li>";

    // Save subtask to local storage
    var subtasks = localStorage.getItem('subtasks') || '';
    subtasks += "Sub Task: " + subTask + ", Date: " + subTaskDate + '\n';
    localStorage.setItem('subtasks', subtasks);
}

function displayTask(mainTask, dueDate, subtasks) {
    var taskOutputs = document.getElementById('taskOutputs');

    // Create task output element
    var taskOutput = "<div class='taskOutput'><p>Main Task: " + mainTask + ", Due Date: " + dueDate + "</p><ul class='subtasks'>";

    // Display subtasks if they exist
    if (subtasks) {
        var subtasksArray = subtasks.split('\n');
        subtasksArray.forEach(function(subtask) {
            if (subtask.trim() !== '') {
                taskOutput += "<li>" + subtask + "</li>";
            }
        });
    }

    taskOutput += "</ul></div>";

    // Display task output
    taskOutputs.innerHTML += taskOutput;
}
