import { Task } from "../model/Task.js";
import { TaskList } from "../model/TaskList.js";
import { TaskDetailPanel } from "./TaskDetailPanel.js";
import { TaskDate } from "../util/TaskDate.js";

export const TaskListPanel = {

    /*
     * html representing the icon for unfolding a task list item
     */
    foldShow: "<i class=\"bi bi-caret-right-fill\"></i>",

    /*
     * html representing the icon for folding a task list item
     */
    foldHide: "<i class=\"bi bi-caret-down\"></i>",

    foldMap: new Map([]),

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

        /*
         * Recursive function that renders a task list item and its children, if it has any.
         * @returns {HTMLLIElement} The rendered list item.
         */
        const recRender = (t) => {
            let li = document.createElement("li");

            let fold = document.createElement("span");
            fold.classList.add("task-handle-fold");

            if (t.children.length === 0) {
                // no children, hide fold icon
                fold.textContent = "";
            } else {
                // has children
                if (!TaskListPanel.foldMap.has(t.uuid)) {
                    TaskListPanel.foldMap.set(t.uuid, false); // unfolded by default
                }
                // set fold icon depending on fold state
                fold.innerHTML = TaskListPanel.foldMap.get(t.uuid) ? TaskListPanel.foldShow : TaskListPanel.foldHide;
            }

            fold.addEventListener("click", function() {
                let refUl = fold.parentElement.querySelector('ul');

                refUl.style.display = (refUl.style.display === "none" ? "block" : "none");
                // noinspection EqualityComparisonWithCoercionJS
                fold.innerHTML =
                    (fold.innerHTML == TaskListPanel.foldHide ? TaskListPanel.foldShow : TaskListPanel.foldHide);
                TaskListPanel.foldMap.set(t.uuid, (refUl.style.display === "none"));
            })
            li.appendChild(fold);

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
            span.dataset.related = "false";
            span.dataset.done = t.done;
            span.textContent = t.title;
            span.addEventListener("click", (e) => {
                let l = window.liveTaskList;
                l.focus(l.search(e.currentTarget.dataset.taskId));
            });

            t.domElement = span;

            li.appendChild(span);

            // add due date depending on setting
            if (t.dueDate) {
                switch (tl.settings.get("due-display")) {
                    case "none":
                        break;
                    case "dates":
                        let spanDueDate = document.createElement("span");
                        spanDueDate.classList.add("task-small-due-date");
                        spanDueDate.textContent = TaskDate.formatDateDisplay(t.dueDate);
                        spanDueDate.style.color = (t.done? "darkgray" : TaskDate.getColour(t.dueDate));
                        li.appendChild(spanDueDate);
                        break;
                    case "badges":
                        let spanBadge = TaskDate.getBadge(t.dueDate);
                        if (spanBadge && !t.done) li.appendChild(spanBadge);
                        break;
                    case "colours":
                        span.style.color = (t.done? "darkgray" : TaskDate.getColour(t.dueDate));
                        break;
                    default:
                        console.error("invalid due-display setting");
                }
            }

            if (t.children.length > 0) {
                let childUl = document.createElement("ul");
                for (let c of t.children) {
                    childUl.appendChild(recRender(c));
                }
                if (TaskListPanel.foldMap.get(t.uuid)) {
                    childUl.style.display = "none";
                } else {
                    childUl.style.display = "block";
                }
                li.appendChild(childUl);
            }

            return li;
        }


        // for every top-level task, create a list item
        for (let t of tl.tasks) {
            ul.appendChild(recRender(t));
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
        if (tl.activeTask) {
            tl.activeTask.domElement.dataset.selected = "true";
        }

        // add task list to view
        taskListView.appendChild(ul);

        // set as live task list
        /**
         * The currently active `TaskList` instance that manages the tasks that are on screen.
         */
        window.liveTaskList = tl;
    }
};