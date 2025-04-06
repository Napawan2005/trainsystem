// initial-db.js

// Initialize RouteDB: Create object store "routes" if not already created.
function initRouteDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("RouteDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("routes")) {
                db.createObjectStore("routes", { keyPath: "routeID" });
            }
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) =>
            reject("Error opening RouteDB: " + event.target.errorCode);
    });
}

// Initialize UserDB: Create object store "users" if not already created.
function initUserDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("UserDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("users")) {
                const store = db.createObjectStore("users", {
                    keyPath: "userID",
                    autoIncrement: true,
                });
                // Create an index on username for uniqueness
                store.createIndex("username", "username", { unique: true });
            }
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) =>
            reject("Error opening UserDB: " + event.target.errorCode);
    });
}

// Initialize TicketDB: Create object store "tickets" if not already created.
function initTicketDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TicketDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("tickets")) {
                db.createObjectStore("tickets", { keyPath: "ticketID", autoIncrement: true });
            }
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) =>
            reject("Error opening TicketDB: " + event.target.errorCode);
    });
}

// Initialize SeatClassDB: Create object store "seatClass" if not already created.
function initSeatClassDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("SeatClassDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("seatClass")) {
                const store = db.createObjectStore("seatClass", { keyPath: "class" });
                // Add initial lang-swap-data for seat classes
                store.add({ class: "A", price: 300 });
                store.add({ class: "B", price: 200 });
                store.add({ class: "C", price: 100 });
            }
        };
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) =>
            reject("Error opening SeatClassDB: " + event.target.errorCode);
    });
}

// Main initialization function to be imported and invoked.
export async function initDatabases() {
    try {
        const routeDB = await initRouteDB();
        const userDB = await initUserDB();
        const ticketDB = await initTicketDB();
        const seatClassDB = await initSeatClassDB();
        console.log("All databases initialized successfully.");
    } catch (error) {
        console.error("Error initializing databases:", error);
    }
}