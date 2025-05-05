/**
 * Represents a task as a core piece of logic in the lewtwo app.
 */
export class Task
{
    // fields

    /** unique ID of the task */
    uuid;

    /** title of the task as it will appear in the task list */
    title;

    /** full-sized details on this task */
    description;

    /** parent task for hierarchy */
    parent;

    /** child tasks for hierarchy */
    #children;

    /** time at which task was created */
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
     * @param {Task} parent parent task, this task will automatically be added to its parents child list.
     * for a top-level task, pass null.
     * @param {Date} creationDate time of creation of task
     * @param {Date} dueDate time when task is due
     * @param {boolean} done determines if task is done
     */
    constructor(
        title,
        description,
        parent,
        creationDate,
        dueDate,
        done
    ) {
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
