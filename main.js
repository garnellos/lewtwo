import { Task } from "./model/Task.js";
import { TaskList } from "./model/TaskList.js";
import { TaskListPanel } from "./ui/TaskListPanel.js";
import { TaskDetailPanel } from "./ui/TaskDetailPanel.js";
import { TaskDate } from "./util/TaskDate.js";

// debug assignments so modules can be used in the console
window.logic = {
    model: {},
    util: {},
    ui: {}
}
window.logic.model.Task = Task;
window.logic.model.TaskList = TaskList;
window.logic.util.TaskDate = TaskDate;
window.logic.ui.TaskListPanel = TaskListPanel;
window.logic.ui.TaskDetailPanel = TaskDetailPanel;
// end debug assignments

let taskList = new TaskList();
TaskListPanel.render(taskList);

document.querySelector("main").addEventListener("click", (e) => {
    // check if the clicked element is a task handle
    if (!e.target.closest('.task-handle') && !e.target.closest('.task-handle-checkbox')) {
        window.liveTaskList.unfocus();
    }
    // if not: don't unfocus
});

document.querySelector("#menu-toggle").addEventListener("click", () => {
    document.querySelector("#menu").style.display =
        (document.querySelector("#menu").style.display === "none" ? "inline-block" : "none");
});

document.querySelector("#menu-button-expand-all").addEventListener("click", () => {
    TaskListPanel.foldMap = new Map([]);
    TaskListPanel.render(window.liveTaskList);
});

document.querySelector("#menu-select-due-display").addEventListener("change",
    (e) => {
    window.liveTaskList.settings.set("due-display", e.target.value);
    TaskListPanel.render(window.liveTaskList);
});