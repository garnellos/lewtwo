/**
 * Represents a task as a core piece of logic in the lewtwo app.
 */
class Task
{
    // fields

    /** unique ID of the task */
    uuid;

    /** title, will appear in task list */
    title;

    /** full-sized details on this task */
    description;

    /** parent task for hierarchy */
    parent;

    /** child tasks for hierarchy */
    #children;

    /** time of creation of task */
    #creationDate;

    /** time when task is due */
    dueDate;

    /** determines if task is done */
    done;

    /** @type HTMLElement
     * The DOM Element of this task, if it is already rendered. */
    domElement;


    // constructor

    /**
     * Constructs a new task object with all necessary attributes.
     * @param {string} title title of the task as to be displayed in task list
     * @param {string} description full-sized details on this task
     * @param {Task} parent parent task, this task will automatically be added to its parents child list. for a top-level task, pass null.
     * @param {Date} creationDate time of creation of task
     * @param {Date} dueDate time when task is due
     * @param {boolean} done determines if task is done
     */
    constructor(title, description, parent, creationDate, dueDate, done)
    {
        this.uuid = crypto.randomUUID();
        this.title = title;
        this.description = description;

        this.parent = parent;
        if (parent != null) parent.addChild(this); // add to parents' list if no top-level task
        
        this.#children = [];
        this.#creationDate = creationDate;
        this.dueDate = dueDate;
        this.done = done;
    }


    // getters

    /** @returns creation date of the task. */
    get creationDate()
    {
        return this.#creationDate;
    }

    /** @returns array of all child tasks. */
    get children()
    {
        return this.#children;
    }


    // methods
    
    /** Adds a child task. */
    addChild(t)
    {
        if (t instanceof Task) {
            this.#children.push(t);
        } else {
            throw new Error("argument is not an instance of task");
        }
    }
}

/**
 * Represents a list of top-level tasks, i.e. instances of the Task class.
 */
class TaskList
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

    /** Returns DOM nodes for an HTML view of the task list. */
    render()
    {
        // select viewport
        let taskListView = document.querySelector("#panel-task-list");

        // select and clear ul
        let ul = document.createElement("ul");
        taskListView.innerHTML = "";

        // for every task, create a list item
        for (let t of this.tasks) {
            let li = document.createElement("li");

            let check = document.createElement("input");
            check.setAttribute("type", "checkbox");
            check.checked = t.done;
            check.addEventListener("change", function() {
                t.done = !t.done;
                window.liveTaskList.render();
                window.liveTaskList.#updateDetailView();
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
                let taskTitle = document.querySelector("#new-task-name").value
                if (taskTitle === "") return;

                tasks.addTask(
                    new Task(
                        taskTitle, // title
                        null,       // description
                        null,       // parent
                        new Date(), // creationDate
                        null,       // dueDate
                        false));    // done
                tasks.render();
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

        if (this.activeTask)
            this.activeTask.domElement.dataset.selected = true;

        // add task list to view
        taskListView.appendChild(ul);
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
     *
     * @param {Task} t Task to be focused.
     */
    focus(t)
    {
        if (!(t instanceof Task)) // control if t is a Task object
            throw new Error("Argument t must be a Task object");

        if (this.activeTask) this.activeTask.domElement.dataset.selected = "false";
        this.activeTask = t;
        t.domElement.dataset.selected = "true";

        this.#updateDetailView();
    }

    #updateDetailView() {
        let formatDateTime = function(date) {
            if (!date) return "-";
            if (!(date instanceof Date)) date = new Date(date);
            // z.B. 29.05.2024, 19:12
            return date.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }) + " " + date.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit"
            });
        };

        let t = this.activeTask;

        // show task detail panel and hide "no task selected" panel
        document.querySelector("#panel-no-task-selected").style.display = "none";
        document.querySelector("#panel-task-details").style.display = "block";

        // alter detail panel to contain selected task details
        let titleElement        = document.querySelector("#active-task-title");
        let descriptionElement  = document.querySelector("#active-task-description");
        let dueDateElement      = document.querySelector("#active-task-due-date");
        let doneElement         = document.querySelector("#active-task-done");
        document.querySelector("#active-task-creation-date").textContent = formatDateTime(t.creationDate);
        document.querySelector("#active-task-uuid").textContent = t.uuid;

        titleElement.textContent = t.title;
        descriptionElement.textContent = t.description;
        dueDateElement.textContent = formatDateTime(t.dueDate);
        doneElement.checked = t.done;

        doneElement.addEventListener("change", function() {
            t.done = !t.done;
            window.liveTaskList.render();
        });
    }
}

