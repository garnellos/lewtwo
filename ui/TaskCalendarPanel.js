import { TaskList } from "../model/TaskList.js";
import { TaskDate } from "../util/TaskDate.js";

export const TaskCalendarPanel = {
    summon: () => {
        window.liveMainPanel = TaskCalendarPanel;
        document.querySelector("#panel-main-view").innerHTML = "Loading TaskCalendarPanel...";
        document.querySelector("#panel-main-view").className = "panel-task-calendar";

        document.querySelector("#view-switch-calendar").classList.add("active");
        document.querySelector("#view-switch-list").classList.remove("active");

        TaskCalendarPanel.render(window.liveTaskList);
    },

    render: (tl = window.liveTaskList) => {
        // Validate that the provided argument is an instance of TaskList
        if (!(tl instanceof TaskList)) {
            throw new Error("Argument tl must be an instance of TaskList");
        }

        const recursiveSearchByDate = (date, tasks) => {
            let result = [];
            for (let t of tasks) {
                if (TaskDate.compareToToday(new Date(t.dueDate)) == 0) {
                    result.push(t);
                } else if (t.children.length > 0) {
                    result = result.concat(recursiveSearchByDate(date, t.children));
                }
            }
            return result;
        }

        // select and clear viewport
        let taskListView = document.querySelector("#panel-main-view");
        taskListView.innerHTML = "";

        let headline = document.createElement("h1");
        headline.textContent = "Due today";
        taskListView.appendChild(headline);

        const dueToday = recursiveSearchByDate(new Date(), tl.tasks);
        for (let t of dueToday) {
            let p = document.createElement("p");
            p.textContent = t.title;
            taskListView.appendChild(p);
        }

        window.liveTaskList = tl;
    }
};
