import { TaskList } from "./model/TaskList.js";
import { TaskListPanel } from "./ui/TaskListPanel.js";

let taskList = new TaskList();
TaskListPanel.render(taskList);

document.querySelector("main").addEventListener("click", (e) => {
    // check if the clicked element is a task handle
    if (!e.target.closest('.task-handle') && !e.target.closest('.task-handle-checkbox')) {
        window.liveTaskList.unfocus();
    }
    // if not: don't unfocus
});