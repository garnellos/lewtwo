/**
 * Represents a task as a core piece of logic in the litwo app.
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

    /**
     * @type HTMLElement
     * The DOM Element of this task, if it is already rendered.
     */
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
        if (parent instanceof Task) parent.addChild(this); // add to parents' list if no top-level task

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

    /** Adds a child task.
     * @param {Task} t The task to add. Must be an instance of the Task class.
     * @throws {Error} Throws an error if the provided argument is not an instance of the Task class.
     */
    addChild(t)
    {
        if (!(t instanceof Task)) { // check if t is a Task
            throw new Error("argument is not an instance of task");
        }
        if (this.#children.includes(t)) { // avoid duplicate child assignments
            return;
        }
        this.#children.push(t);
    }

    /** Removes a direct child task (not including child tasks of child tasks, etc.).
     * @param {Task} t The task to remove.
     * @returns {boolean} True if the task was successfully removed, false otherwise. */
    removeChild(t)
    {
        if (this.#children.includes(t)) {
            const c = this.#children.splice(this.#children.indexOf(t), 1);
            return c[0] === t;
        }
    }

    /** Determines if the provided Task object is a child of this task.
     * @param {Task} t The task to check for.
     * @param {boolean} [anyDepth=false] If true, checks if the provided task is a child of this task or any of its
     * child tasks. If false, only checks if the provided task is a direct child of this task.
     * @returns {boolean} True if the provided task is a child of this task, false otherwise.
     */
    isChild(t, anyDepth = false)
    {
        if (anyDepth) {
            if (this.children.includes(t)) return true;
            for (let c of this.children) {
                if (c.isChild(t, true)) return true;
            }
            return false;
        } else {
            return this.children.includes(t);
        }
    }

    serialise()
    {
        let children = [];
        for (let c of this.children)
            children.push(c.serialise());
        return {
            uuid: this.uuid,
            title: this.title,
            description: this.description,
            parent: this.parent?.uuid,
            creationDate: this.creationDate,
            dueDate: this.dueDate,
            done: this.done,
            children: children
        };
    }

    static deserialise(data, p = null)
    {
        if (!data) return;
        let nDueDate = (data.dueDate? new Date(data.dueDate) : null);
        let t = new Task(
            data.title,
            data.description,
            p,
            data.creationDate,
            nDueDate,
            data.done
        );
        if (data.children) {
            for (let c of data.children) {
                t.addChild(Task.deserialise(c, p));
            }
        }
        return t;
    }
}
