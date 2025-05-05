import { TaskDate } from "../util/TaskDate.js";
import { TaskListPanel } from "./TaskListPanel.js";

export const TaskDetailPanel = {
    render: (task = window.liveTaskList.activeTask) =>
    {
        // if no task selected, show the default panel and return
        if (!task) {
            document.querySelector("#panel-task-details").style.display = "none";
            document.querySelector("#panel-no-task-selected").style.display = "block";
            return;
        }

        // show task detail panel and hide "no task selected" panel
        document.querySelector("#panel-no-task-selected").style.display = "none";
        document.querySelector("#panel-task-details").style.display = "block";

        // alter detail panel to contain selected task details
        document.querySelector("#active-task-creation-date").textContent
            = TaskDate.formatDateTime(task.creationDate);
        document.querySelector("#active-task-uuid").textContent = task.uuid;

        // get elements that require event handling
        let titleElement        = document.querySelector("#active-task-title");
        let descriptionElement  = document.querySelector("#active-task-description");
        let dueDateElement      = document.querySelector("#active-task-due-date");
        let doneElement         = document.querySelector("#active-task-done");

        // set text content to task details as provided
        titleElement.textContent = task.title;
        descriptionElement.innerHTML = task.description || "<i>no description</i>";
        dueDateElement.textContent = TaskDate.formatDateTime(task.dueDate);
        doneElement.checked = task.done;

        document.querySelector("#active-task-button-select-parent").disabled = task.parent ? false : true;

        // add event listeners
        doneElement.onchange = function () {
            task.done = !task.done;
            TaskListPanel.render();
        };

        /*
        titleElement.onclick = function() {
            t.title = prompt("Enter new title: ", t.title) || t.title;
            window.liveTaskList.render();
            window.liveTaskList.updateDetailView();
        }

        descriptionElement.onclick = function() {
            t.description = prompt("Enter new description: ", t.description);
            window.liveTaskList.updateDetailView();
        };
        */
    }
}