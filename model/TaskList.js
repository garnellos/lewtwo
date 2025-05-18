import { Task } from "./Task.js";
import { TaskDetailPanel } from "../ui/TaskDetailPanel.js";
import { TaskListPanel } from "../ui/TaskListPanel.js";

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

    /**
     * sets if the current focus should be locked.
     * @type {boolean}
     */
    lockFocus = false;

    /**
     * Saves settings for this task list. The following keys are in use:<br>
     * <b>due-display</b>: sets in which fashion the due dates are presented in the task list.
     * Possible values: `none`, `dates`, `badges`, `colours`
     */
    settings = new Map();

    // constructor

    constructor()
    {
        this.tasks = [];

        // default setting for due-display
        this.settings.set("due-display", "none");
    }

    // methods

    /** Adds a task to the list.
     * @param {Task} t The task to add. Must be an instance of the Task class.
     * @throws {Error} Throws an error if the provided argument is not an instance of the Task class. */
    addTask(t)
    {
        if (t instanceof Task)
            this.tasks.push(t);
        else
            throw new Error("Parameter is not a Task object.");
    }

    /**
     * Removes a Task instance from the entire task structure, regardless of whether
     * it is a top-level task or a (nested) child task.
     * After successful removal, the user interface is updated accordingly, including the detail view if the removed
     * task was the active task.
     *
     * @param {Task} t The Task object to be removed.
     * @returns {boolean} True if the task was removed, false otherwise.
     */
    removeTask(t)
    {
        // check if the task is in the list at any depth
        if (this.hasTask(t)) {
            // `removed` is true if the task was removed, false otherwise.
            // An anonymous function is used to easily determine the return value of the removeTask(t) call.
            const removed = ((t) => {
                // This nested function is called recursively to allow a deep search and removal of the task,
                // regardless of the depth of the task in the hierarchy.
                let removeFromChildren = (haystack, needle) => {
                    // check if needle is a child of haystack at any depth
                    if (haystack.isChild(needle, true)) {
                        // check if needle is a direct child of haystack
                        if (haystack.isChild(needle, false)) {
                            // if so, needle can be removed right from haystack's children
                            return haystack.removeChild(needle); // remove needle from haystack's children array
                        } else {
                            for (let c of haystack.children) { // check for needle in all of haystack's children
                                if (removeFromChildren(c, needle)) return true;
                            }
                        }

                        // needle was found yet not removed - this should never happen
                        console.error("needle is a deep child of haystack, but not found in any of its children.");
                        return false;
                    }
                    // needle was not found, thus not removed
                    return false;
                };

                for (let e of this.tasks) {
                    // for every top-level task, check if t is this top-level task
                    if (e === t) {
                        // if so, remove t right from this TaskList's array
                        const r = this.tasks.splice(this.tasks.indexOf(e), 1);

                        if (r[0] === e) return true; // successfully removed
                        return false; // failed to remove for whatever reason
                    }

                    // if t was not the top-level task, check the children, and return if t was removed
                    if (removeFromChildren(e, t)) return true;
                }
                return false;
            })(t);

            if (removed) {
                // the DOM only needs to be updated if the task was removed from the list

                // if t is the active task, as it would be if the user removed the task directly, reset the active task
                if (this.activeTask === t) {
                    this.activeTask = null;
                    TaskDetailPanel.renderDetails();
                }

                TaskListPanel.render();
            }

            // return if the deep removal was successful
            return removed;
        }

        // t is nowhere in the list
        return false;
    }

    /**
     * Checks if the provided task is in the list, either as a top-level task or as a child task of any depth.
     * @param t {Task} The task to check for.
     * @returns {boolean} True if the task is in the list, false otherwise.
     */
    hasTask(t)
    {
        for (let task of this.tasks) {
            if (task === t) return true;
            if (task.isChild(t, true)) return true;
        }
        return false;
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

        if (this.lockFocus) {
            // don't change focus if focus is locked.
            console.error("Focus is locked.");
            return;
        }

        if (this.activeTask) this.activeTask.domElement.dataset.selected = "false";
        this.activeTask = t;
        t.domElement.dataset.selected = "true";

        TaskDetailPanel.renderDetails(t);
    }

    /**
     * Removes focus from the currently active task, if any.
     */
    unfocus()
    {
        if (this.lockFocus) {
            // don't change focus if focus is locked
            console.error("Focus is locked.");
            return;
        }

        if (this.activeTask) this.activeTask.domElement.dataset.selected = "false";
        this.activeTask = null;

        TaskDetailPanel.renderDetails(null);
    }

    serialise()
    {
        let tasks = [];
        for (let t of this.tasks) {
            tasks.push(t.serialise());
        }
        let settings = [];
        this.settings.forEach((value, key) => {
            console.log(key + " : " + value);
            settings.push([key, value]);
        });
        return {
            tasks,
            settings
        };
    }

    static deserialise(data)
    {
        if (!data) return;
        if (!data.tasks) return;
        if (!data.settings) return;

        let tl = new TaskList();
        for (let t of data.tasks) {
            tl.tasks.push(Task.deserialise(t, null));
        }
        for (let [key, value] of data.settings) {
            tl.settings.set(key, value);
        }

        return tl;
    }
}
