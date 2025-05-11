import { TaskDate } from "../util/TaskDate.js";
import { TaskListPanel } from "./TaskListPanel.js";
import { Task } from "../model/Task.js";

export const TaskDetailPanel = {
    /**
     * Renders the details of the currently selected task in the task details panel.
     * If no task is selected, shows a "no task selected" panel instead.
     *
     * This function updates the UI elements within the task detail panel to display
     * the properties and attributes of the provided task. It also binds appropriate
     * event listeners for interactive functionality, such as marking a task as done
     * or editing the task.
     *
     * @function
     * @param {Task} [task=window.liveTaskList.activeTask] - The task object to display in the details panel.
     * If not provided, the active task from `window.liveTaskList` is used.
     */
    renderDetails: (task = window.liveTaskList.activeTask) =>
    {
        // if no task selected, show the default panel and return
        if (!task) {
            document.querySelector("#panel-task-details").style.display = "none";
            document.querySelector("#panel-task-edit").style.display = "none";
            document.querySelector("#panel-no-task-selected").style.display = "block";
            return;
        }

        // show task detail panel and hide "no task selected" / task edit panel
        document.querySelector("#panel-no-task-selected").style.display = "none";
        document.querySelector("#panel-task-edit").style.display = "none";
        document.querySelector("#panel-task-details").style.display = "block";

        // alter detail panel to contain selected task details
        document.querySelector("#active-task-creation-date").textContent
            = TaskDate.formatDateDisplay(task.creationDate);
        document.querySelector("#active-task-uuid").textContent = task.uuid;

        // get elements that require event handling
        let titleElement        = document.querySelector("#active-task-title");
        let descriptionElement  = document.querySelector("#active-task-description");
        let dueDateElement      = document.querySelector("#active-task-due-date");
        let doneElement         = document.querySelector("#active-task-done");

        // set text content to task details as provided
        titleElement.textContent = task.title;
        descriptionElement.innerHTML = task.description || "<i>no description</i>";
        dueDateElement.textContent = TaskDate.formatDateDisplay(task.dueDate);
        doneElement.checked = task.done;

        // add event listeners
        doneElement.onchange = function () {
            // toggle task-done state
            task.done = !task.done;
            TaskListPanel.render();
        };

        document.querySelector("#active-task-button-edit").onclick = function() {
            TaskDetailPanel.renderEdit(task);
        };

        document.querySelector("#active-task-button-add-child").onclick = function() {
            let title = prompt("Enter new task title...")?.trim();
            if (!title || title.trim() === "") return;
            new Task(
                title,
                "",
                task,
                new Date(),
                null,
                false
            );
            TaskListPanel.render();
        }

        document.querySelector("#active-task-button-remove").onclick = function() {
            if (confirm("Are you sure you want to delete this task (and all of its children)?")) {
                const s = window.liveTaskList.removeTask(task);
                if (!s) console.error("failed to remove active task");
            }
        }
    },

    /**
     * Renders the edit panel and sets it up to edit the task parameter, alternatively the active task of the live task
     * list. Also sets up handling for saving and discarding changes.
     * @function
     * @param {Task} [task=window.liveTaskList.activeTask] The task to be edited.
     */
    renderEdit: (task = window.liveTaskList.activeTask) =>
    {
        if (!task) return;

        // lock focus
        window.liveTaskList.activeTask = task;
        window.liveTaskList.lockFocus = true;

        // hide details, show edit panel
        document.querySelector("#panel-task-edit").style.display = "block";
        document.querySelector("#panel-task-details").style.display = "none";
        document.querySelector("#panel-no-task-selected").style.display = "none";

        // fill in task details
        document.querySelector("#edit-task-title").value = task.title;
        document.querySelector("#edit-task-description").value = task.description;
        document.querySelector("#edit-task-due-date").value = TaskDate.formatDateValue(task.dueDate);
        document.querySelector("#edit-task-uuid").textContent = task.uuid;

        // add button event listeners
        document.querySelector("#edit-task-button-save").onclick = function() {
            // check if task title input has text
            if (document.querySelector("#edit-task-title").value !== "") {
                // if yes: save
                task.title = document.querySelector("#edit-task-title").value;
            } else {
                // else: discard change, output error
                console.error("task title must not be empty");
            }

            // save description and due date
            task.description = document.querySelector("#edit-task-description").value;
            task.dueDate =
                new Date(TaskDate.formatDateValue(document.querySelector("#edit-task-due-date").value));

            // unlock focus
            window.liveTaskList.lockFocus = false;

            // render panels as needed
            TaskListPanel.render();
            TaskDetailPanel.renderDetails();
        };
        document.querySelector("#edit-task-button-cancel").onclick = function() {
            TaskDetailPanel.renderDetails();
            window.liveTaskList.lockFocus = false;
        };
    }
}