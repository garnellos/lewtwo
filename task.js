/**
 * Represents a task as a core piece of logic in the lewtwo app.
 */
class Task
{
    // fields

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
        this.#children.push(t);
    }

    /** Marks a task as done. */
    done()
    {
        done = true;
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

    /** Returns DOM nodes for a HTML view of the task list. */
    render()
    {
        // select viewport
        let taskListView = document.querySelector("#task-list-view");

        // select and clear ul
        let ul = document.createElement("ul");
        taskListView.innerHTML = "";

        // for every task, create a list item
        for (let t of this.tasks) {
            let li = document.createElement("li");
            let span = document.createElement("span");
            span.classList.add("task-handle");
            span.textContent = t.title;
            li.appendChild(span);
            ul.appendChild(li);
        }

        // add buttons for adding additional tasks...
        ul.appendChild((() => {
            let li = document.createElement("li");
            li.appendChild((() => {
                let input = document.createElement("input");
                input.setAttribute("id", "new");
                input.setAttribute("type", "text");
                input.setAttribute("placeholder", "Neue Aufgabe...");
                return input;
            })());
            li.appendChild((() => {
                let input = document.createElement("input");
                input.setAttribute("id", "new-create");
                input.setAttribute("type", "button");
                input.setAttribute("value", "OK");
                input.onclick = function() {
                    let newTaskName = document.querySelector("#new").value;
                    alert("You clicked! New Task: " + newTaskName);
                    tasks.addTask(new Task(newTaskName, null, null, Date.now(), null, false));
                };
                return input;
            })());
            return li;
        })());

        // add task list to view
        taskListView.appendChild(ul);
    }
}
