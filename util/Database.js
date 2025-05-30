import { TaskList } from "../model/TaskList.js";

export const Database = {
    dbName: "litwo",
    dbVersion: 1,
    dbStoreName: "TaskList",

    // open IndexedDB
    openDatabase: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(Database.dbName, Database.dbVersion);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(Database.dbStoreName)) {
                    db.createObjectStore(Database.dbStoreName, { keyPath: "key" });
                }
            };
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    },

    saveTaskList: async function() {
        const db = await Database.openDatabase();
        const tx = db.transaction(Database.dbStoreName, "readwrite");
        const store = tx.objectStore(Database.dbStoreName);
        store.put({key: "taskList", tasks: window.liveTaskList.serialise(), lastUpdated: Date.now()});
    },

    loadTaskList: async function() {
        const db = await Database.openDatabase();
        const tx = db.transaction(Database.dbStoreName, "readonly");
        const store = tx.objectStore(Database.dbStoreName);
        const result = store.get("taskList");
        return new Promise((resolve, reject) => {
            result.onsuccess = event => {
                const data = event.target.result;
                resolve(data? data.tasks : new TaskList());
            };
            result.onerror = event => reject(event.target.error);
        });
    }
}