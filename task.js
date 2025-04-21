class Task
{
    // fields

    /** title, will appear in task list */
    title;

    /** full-sized details on this task */
    description;

    /** parent task for hierarchy */
    parent;

    /** time of creation of task */
    #creationDate;

    /** time when task is due */
    dueDate;

    /** determines if task is done */
    done;


    // constructor

    constructor(title, description, parent, creationDate, dueDate, done)
    {
        this.title = title;
        this.description = description;
        this.parent = parent;
        this.#creationDate = creationDate;
        this.dueDate = dueDate;
        this.done = done;
    }


    // getters

    get creationDate()
    {
        return this.#creationDate;
    }


    // methods
    
    /** Marks a task as done. */
    done()
    {
        done = true;
    }
}
