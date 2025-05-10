import { Task } from "../model/Task.js";
import { TaskList } from "../model/TaskList.js";
import { TaskDetailPanel } from "./TaskDetailPanel.js";

export const TaskListPanel = {

    /**
     * Returns DOM nodes for an HTML view of the task list.
     * @param {TaskList} tl The task list object to be rendered.
     */
    render: (tl = window.liveTaskList) =>
    {
        // Validate that the provided argument is an instance of TaskList
        if (!(tl instanceof TaskList)) {
            throw new Error("Argument tl must be an instance of TaskList");
        }
        
        // select and clear viewport
        let taskListView = document.querySelector("#panel-task-list");
        taskListView.innerHTML = "";

        // select ul
        let ul = document.createElement("ul");

        // TODO recursion, display of children

        // for every task, create a list item
        for (let t of tl.tasks) {
            let li = document.createElement("li");

            let check = document.createElement("input");
            check.setAttribute("type", "checkbox");
            check.classList.add("task-handle-checkbox");
            check.checked = t.done;
            check.addEventListener("change", function() {
                t.done = !t.done;
                TaskListPanel.render(tl);
                TaskDetailPanel.renderDetails();
            });
            li.appendChild(check);

            let span = document.createElement("span");
            span.classList.add("task-handle");
            span.dataset.taskId = t.uuid;
            span.dataset.selected = "false";
            span.dataset.done = t.done;
            span.textContent = t.title;
            span.addEventListener("click", (e) => {
                let l = window.liveTaskList;
                l.focus(l.search(e.currentTarget.dataset.taskId));
            });

            t.domElement = span;

            li.appendChild(span);
            ul.appendChild(li);
        }

        // add buttons for adding additional tasks...
        ul.appendChild((() => {
            let li = document.createElement("li");

            /**
             * Handles the creation of a new task and updates the task list.
             *
             * This function retrieves the task title from the input field with the ID "new-task-name".
             * If the input is empty, the function terminates without taking any action.
             * Otherwise, it creates a new `Task` instance with the given title and other properties set to default values.
             * The new task is added to the task list, and the updated task list is rendered.
             */
            let handler = function() {
                let taskTitle = document.querySelector("#new-task-name").value;
                if (taskTitle === "") return;

                let n = new Task(
                    taskTitle,
                    "",
                    null,
                    new Date(),
                    null,
                    false
                );
                tl.addTask(n);
                TaskListPanel.render(tl);
                tl.focus(n);
            }

            li.appendChild((() => {
                let input = document.createElement("input");
                input.setAttribute("id", "new-task-name");
                input.setAttribute("type", "text");
                input.setAttribute("placeholder", "New task...");
                input.addEventListener("keypress", function(event) {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        handler();
                        document.querySelector("#new-task-name").focus();
                    }
                });
                return input;
            })());
            li.appendChild((() => {
                let input = document.createElement("button");
                input.setAttribute("id", "new-create");
                input.textContent = "OK";
                input.addEventListener("click", handler);
                return input;
            })());
            return li;
        })());

        // If there's an active task, mark its DOM element as selected to highlight it in the UI
        if (tl.activeTask)
            tl.activeTask.domElement.dataset.selected = "true";

        // add task list to view
        taskListView.appendChild(ul);
    }
};