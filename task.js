"use strict";

class Task
{
    // fields

    title;          // title, will appear in task list
    description;    // full-sized details on this task
    parent;         // parent task for hierarchical view
    #creationDate;  // time of creation of task
    startDate;      // 
    dueDate;        // 
    done;           // true if done, otherwise considered not done

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
