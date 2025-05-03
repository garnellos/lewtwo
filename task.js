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

    /** Marks a task as done. */
    markAsDone()
    {
        this.done = true;
    }
}

/**
 * Represents a list of top-level tasks, i.e. instances of the Task class.
 */
class TaskList
{
    // fields

    /** array of top-level tasks */
    tasks;


    // constructor

    constructor()
    {
        this.tasks = [];
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
            let span = document.createElement("span");
            span.classList.add("task-handle");
            span.dataset.taskId = t.uuid;
            span.textContent = t.title;
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
                let input = document.createElement("input");
                input.setAttribute("id", "new-create");
                input.setAttribute("type", "button");
                input.setAttribute("value", "OK");
                input.addEventListener("click", handler);
                return input;
            })());
            return li;
        })());

        // add task list to view
        taskListView.appendChild(ul);
    }

    /**
     * Searches for a task within the task hierarchy by its unique identifier (UUID) using a depth-first search (DFS)
     * algorithm.
     *
     * @param {string} uuid - The unique identifier of the task to search for.
     * @return {Object|null} The task object &ndash; or, if no matching task is found, `null`.
     */
    search(uuid)
    {
        const dfs = function(task, uuid) {
            if (task.uuid === uuid) return task;
            for (let t of task.children) {
                const s = dfs(t, uuid);
                if (s) return s;
            }
            return null;
        }

        for (let t of this.tasks) {
            let r = dfs(t, uuid);
            if (r != null) return r;
        }
    }

    /**
     *
     * @param {Task} t Task to be focused.
     */
    focus(t)
    {
        if (!(t instanceof Task)) { // control if t is a Task object
            return;
        }


    }
}
