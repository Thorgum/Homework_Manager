document.addEventListener("DOMContentLoaded", function() {
    // Retrieve loadClicked from local storage
    var loadClicked = localStorage.getItem('loadClicked');
    console.log("loadClicked:", loadClicked);

    // Clear local storage if Load button wasn't clicked
    if (!loadClicked || loadClicked !== 'false') {
        console.log("Clearing local storage...");
        localStorage.clear();
    }
});
function addMainTask() {
    var mainTask = document.getElementById('mainTask').value;
    var dueDate = document.getElementById('dueDate').value;
    // Debugging
    console.log("Adding Main Task:", mainTask);
    console.log("Due Date:", dueDate);

    // Increment main tasks count
    var mainTasksCount = localStorage.getItem('mainTasksCount') || 0;
    mainTasksCount++;
    localStorage.setItem('mainTasksCount', mainTasksCount);

    // Save main task to local storage
    localStorage.setItem('mainTask_' + (mainTasksCount - 1), mainTask);
    localStorage.setItem('dueDate_' + (mainTasksCount - 1), dueDate);
    countdown(dueDate)
    // Call displayMainTask to show the newly added main task
    displayMainTask(mainTask, dueDate, mainTasksCount - 1);
}

function countdown(duedate) {
    // Get the current date
    today = new Date();
    console.log(today)
// Calculate the difference in days between today and Christmas
    var one_day = 1000 * 60 * 60 * 24;
    var due = new Date(duedate[0]+duedate[1]+duedate[2]+duedate[3],duedate[5]+duedate[6]-1,duedate[8]+duedate[9])
// Log the number of days left until Christmas to the console
    console.log(due)
    var countdown = console.log(Math.ceil((  due.getTime() - today.getTime()) / (one_day)) +
        " days left");
    localStorage.setItem('countdown',countdown)

}

function addSubTask(taskIndex) {
    var subTask = document.getElementById('subTask_' + taskIndex).value;
    var subTaskDate = document.getElementById('subTaskDate_' + taskIndex).value;

    // Increment subtasks count for the specified main task
    var subtasksCount = localStorage.getItem('subtasksCount_' + taskIndex) || 0;
    subtasksCount++;
    localStorage.setItem('subtasksCount_' + taskIndex, subtasksCount);

    // Save subtask to local storage
    localStorage.setItem('subTask_' + taskIndex + '_' + (subtasksCount - 1), subTask);
    localStorage.setItem('subTaskDate_' + taskIndex + '_' + (subtasksCount - 1), subTaskDate);

    // Display the added subtask
    displaySubtask(subTask, subTaskDate, taskIndex);

    // Clear input fields
    document.getElementById('subTask_' + taskIndex).value = '';
    document.getElementById('subTaskDate_' + taskIndex).value = '';
}

function displayMainTask(mainTask, dueDate, taskIndex,countdown) {
    var output = document.getElementById('output');
    console.log(countdown)
    // Create HTML for main task
    var taskContainer = `
        <div class="taskContainer">
            <div class="mainTaskOutput">Main Task: ${mainTask}, Due Date: ${countdown}</div>
            
            <!-- Subtask section -->
            <div id="subTaskSection_${taskIndex}" class="subTaskSection">
                <label><b>Sub Task</b></label>
                <input type="text" name="subtask" id="subTask_${taskIndex}">
                <input type="date" name="subtaskDate" id="subTaskDate_${taskIndex}">
                <button id="addSubTaskButton_${taskIndex}" onclick="addSubTask(${taskIndex})">Add Sub Task</button>
            </div>
        </div>
    `;

    // Append the taskContainer to the output element
    output.innerHTML += taskContainer;
}

function displaySubtask(subTask, subTaskDate, taskIndex) {
    var subtasksList = document.getElementById('subTaskSection_' + taskIndex);
    subtasksList.innerHTML += `<ul class="subtasks"><li>Sub Task: ${subTask}, Due: ${subTaskDate}</li></ul>`;
}

function showSubTaskSection(taskIndex) {
    var subTaskSection = document.getElementById('subTaskSection_' + taskIndex);
    if (subTaskSection) {
        subTaskSection.style.display = 'block';
        console.log("Subtask section shown for task index:", taskIndex);
    } else {
        console.error("Subtask section with id 'subTaskSection_" + taskIndex + "' not found!");
    }
}
