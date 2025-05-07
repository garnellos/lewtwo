import { TaskDate } from "../util/TaskDate.js";
import { TaskListPanel } from "./TaskListPanel.js";

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
     * @param {Object} [task=window.liveTaskList.activeTask] - The task object to display in the details panel.
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

        document.querySelector("#active-task-button-select-parent").disabled = !task.parent;

        // add event listeners
        doneElement.onchange = function () {
            task.done = !task.done;
            TaskListPanel.render();
        };

        // edit button events
        document.querySelector("#active-task-button-edit").onclick = function() {
            TaskDetailPanel.renderEdit(task);
        };

        /*
        titleElement.onclick = function() {
            t.title = prompt("Enter new title: ", t.title) || t.title;
            window.liveTaskList.renderDetails();
            window.liveTaskList.updateDetailView();
        }

        descriptionElement.onclick = function() {
            t.description = prompt("Enter new description: ", t.description);
            window.liveTaskList.updateDetailView();
        };
        */
    },

    renderEdit: (task = window.liveTaskList.activeTask) =>
    {
        if (!task) return;

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
            task.title = document.querySelector("#edit-task-title").value;
            task.description = document.querySelector("#edit-task-description").value;
            task.dueDate = TaskDate.formatDateValue(document.querySelector("#edit-task-due-date").value);
            TaskListPanel.render();
            TaskDetailPanel.renderDetails();
        };
        document.querySelector("#edit-task-button-cancel").onclick = function() {
            TaskDetailPanel.renderDetails();
        };
    }
}