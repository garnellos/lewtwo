import { Task } from "./Task.js";
import { TaskDetailPanel } from "../ui/TaskDetailPanel.js";

/**
 * Represents a list of top-level tasks, i.e. instances of the Task class.
 */
export class TaskList
{
    // fields

    /**
     * array of top-level tasks
     * @type Task[]
     */
    tasks;

    /**
     * currently selected task
     * @type Task | null
     */
    activeTask = null;


    // constructor

    constructor()
    {
        this.tasks = [];
        /**
         * The currently active `TaskList` instance that manages the tasks that are on screen.
         */
        window.liveTaskList = this;
    }


    // methods

    /** Adds a task to the list. */
    addTask(t)
    {
        if (t instanceof Task)
            this.tasks.push(t);
        else
            throw new Error("Parameter is not a Task object.");
    }

    /**
     * Searches for a task within the task hierarchy by its unique identifier (UUID) using a depth-first search (DFS)
     * algorithm.
     *
     * @param {string} uuid - The unique identifier of the task to search for.
     * @return {Task|null} The task object &ndash; or, if no matching task is found, `null`.
     */
    search(uuid)
    {
        if (typeof uuid !== "string")
            throw new Error("Argument uuid must be a string");

        // recursive function for search through child-trees using a depth-first search (dfs) algorithm
        const dfs = function(task, uuid) {
            if (task.uuid === uuid) return task;
            for (let t of task.children) {
                const s = dfs(t, uuid);
                if (s) return s; // task found
            }
            return null; // if no task is found in this child
        }

        for (let t of this.tasks) {
            // search through every top-level task
            let r = dfs(t, uuid);
            if (r != null) return r; // task found
        }
        return null; // if no task is found

    }

    /**
     * Sets the specified Task object as the active task and updates its visual representation
     * and the detail view accordingly.
     *
     * @param {Task} t - The task to be focused. Must be an instance of the Task class.
     * @throws {Error} Throws an error if the provided argument is not an instance of the Task class.
     */
    focus(t)
    {
        if (!(t instanceof Task)) // control if t is a Task object
            throw new Error("Argument t must be a Task object");

        if (this.activeTask) this.activeTask.domElement.dataset.selected = "false";
        this.activeTask = t;
        t.domElement.dataset.selected = "true";

        TaskDetailPanel.render(t);
    }

    /**
     * Removes focus from the currently active task, if any.
     */
    unfocus()
    {
        if (this.activeTask) this.activeTask.domElement.dataset.selected = "false";
        this.activeTask = null;

        TaskDetailPanel.render(null);
    }
}