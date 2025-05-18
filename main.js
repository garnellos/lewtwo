import { Task } from "./model/Task.js";
import { TaskList } from "./model/TaskList.js";
import { TaskListPanel } from "./ui/TaskListPanel.js";
import { TaskDetailPanel } from "./ui/TaskDetailPanel.js";
import { TaskDate } from "./util/TaskDate.js";
import { Database } from "./util/Database.js";

// debug assignments that allow use of modules from the console
window.logic = {
    model: {},
    util: {},
    ui: {}
};
window.logic.model.Task = Task;
window.logic.model.TaskList = TaskList;
window.logic.util.TaskDate = TaskDate;
window.logic.ui.TaskListPanel = TaskListPanel;
window.logic.ui.TaskDetailPanel = TaskDetailPanel;
// end debug assignments

// load TaskList
Database.loadTaskList().then((data) => {
    TaskListPanel.render(data? TaskList.deserialise(data) : new TaskList());
    console.log("Task list loaded successfully.");
    return data;
});

document.querySelector("main").addEventListener("click", (e) => {
    // check if the clicked element is a task handle
    if (!e.target.closest('.task-handle') && !e.target.closest('.task-handle-checkbox')) {
        window.liveTaskList?.unfocus();
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

document.querySelector("#menu-button-load").addEventListener("click", () => {
    Database.loadTaskList().then((data) => {
        TaskListPanel.render(TaskList.deserialise(data));
        console.log("Task list loaded successfully.");
    })
});

document.querySelector("#menu-button-save").addEventListener("click", () => {
    Database.saveTaskList().then(() => {
        console.log("Task list saved successfully.");
    });
});

// export current list to JSON file
function exportTaskList() {
    const serialised = window.liveTaskList.serialise();
    const blob = new Blob([JSON.stringify(serialised, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "lewtwo_tasks.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}
document.getElementById("menu-button-export").addEventListener("click", exportTaskList);

// create invisible input for file upload
document.getElementById("menu-input-import").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const json = JSON.parse(text);
        TaskListPanel.render(TaskList.deserialise(json));
        alert("Imported task list successfully.");
    } catch (e) {
        alert("Error importing task list! " + e.message);
    }
    document.getElementById("menu-input-import").value = ""; // reset for next upload
});

// assign import button
document.getElementById("menu-button-import").addEventListener("click", () => {
    document.getElementById("menu-input-import").click();
});
