"use strict";

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

    /** time for work on task to be started */
    startDate;

    /** time when task is due */
    dueDate;

    /** determines if task is done */
    done;

    // constructor

    constructor()
    {
        
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
