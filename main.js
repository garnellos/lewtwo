import { Task } from "./model/Task.js";
import { TaskList } from "./model/TaskList.js";
import { TaskListPanel } from "./ui/TaskListPanel.js";
import { TaskDetailPanel } from "./ui/TaskDetailPanel.js";
import { TaskDate } from "./util/TaskDate.js";

// debug assignments that allow use of modules from the console
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

// open IndexedDB
/* the IndexedDB buffer for the lewtwo app */
let dbHandle;

/* name of the IndexedDB database */
const dbName = "lewtwo";

const dbRequest = window.indexedDB.open(dbName, 1);
dbRequest.onerror = (e) => {
    console.error(`IndexedDB error! ${e.target.error?.message}`);
    alert(`Please allow use of IndexedDB to use lewtwo.`);
};
dbRequest.onsuccess = (e) => {
    dbHandle = e.target.result;
};
dbRequest.onupgradeneeded = (e) => {
    const objStore = dbHandle.createObjectStore("TaskList");
};

// create TaskList
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