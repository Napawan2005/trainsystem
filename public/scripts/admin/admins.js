(() => {
    const dbName = "RouteDB";
    const storeName = "routes";
    let db;

    // Open (or create) the IndexedDB database
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onupgradeneeded = (event) => {
                db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: "routeID" });
                }
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
            };

            request.onerror = (event) => {
                reject("Database error: " + event.target.errorCode);
            };
        });
    }

    // Helper function to clear all input fields
    function clearInputs() {
        document.getElementById("routeID").value = "";
        document.getElementById("departure").value = "";
        document.getElementById("destination").value = "";
        document.getElementById("date").value = "";
        document.getElementById("time").value = "";
        document.getElementById("number_of_seat").value = "";
    }

    // Create a new route record
    function createRoute() {
        const routeID = document.getElementById("routeID").value;
        const departure = document.getElementById("departure").value;
        const destination = document.getElementById("destination").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const numberOfSeat = document.getElementById("number_of_seat").value;

        if (!routeID || !departure || !destination || !date || !time || !numberOfSeat) {
            alert("Please fill in all fields.");
            return;
        }

        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const newRoute = {
            routeID: parseInt(routeID),
            departure,
            destination,
            date,
            time,
            number_of_seat: parseInt(numberOfSeat)
        };

        const request = store.add(newRoute);
        request.onsuccess = () => {
            alert("Route created successfully!");
            displayRoutes();
            clearInputs(); // Clear inputs after creation
        };
        request.onerror = () => {
            alert("Error creating route. The route ID may already exist.");
        };
    }

    // Update an existing route record
    function updateRoute() {
        const routeID = document.getElementById("routeID").value;
        if (!routeID) {
            alert("Route ID is required for update.");
            return;
        }
        const departure = document.getElementById("departure").value;
        const destination = document.getElementById("destination").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const numberOfSeat = document.getElementById("number_of_seat").value;

        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const routeIdInt = parseInt(routeID);
        const getRequest = store.get(routeIdInt);

        getRequest.onsuccess = () => {
            const data = getRequest.result;
            if (!data) {
                alert("Route not found.");
                return;
            }
            // Update values (if provided, else keep current)
            data.departure = departure || data.departure;
            data.destination = destination || data.destination;
            data.date = date || data.date;
            data.time = time || data.time;
            data.number_of_seat = numberOfSeat ? parseInt(numberOfSeat) : data.number_of_seat;

            const updateRequest = store.put(data);
            updateRequest.onsuccess = () => {
                alert("Route updated successfully!");
                displayRoutes();
                clearInputs(); // Clear inputs after update
            };
            updateRequest.onerror = () => {
                alert("Error updating route.");
            };
        };

        getRequest.onerror = () => {
            alert("Error retrieving route for update.");
        };
    }

    // Delete a route record
    function deleteRoute() {
        const routeID = document.getElementById("routeID").value;
        if (!routeID) {
            alert("Route ID is required for deletion.");
            return;
        }
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const deleteRequest = store.delete(parseInt(routeID));
        deleteRequest.onsuccess = () => {
            alert("Route deleted successfully!");
            displayRoutes();
            clearInputs(); // Clear inputs after deletion
        };
        deleteRequest.onerror = () => {
            alert("Error deleting route.");
        };
    }

    // Display all routes in the routeList div
    function displayRoutes() {
        const routeListDiv = document.getElementById("routeList");
        routeListDiv.innerHTML = "";

        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.openCursor();
        let routesHTML = "<table>";
        routesHTML += "<tr><th>Route ID</th><th>Departure</th><th>Destination</th><th>Date</th><th>Time</th><th>Seats</th></tr>";

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const route = cursor.value;
                routesHTML += `<tr>
                    <td>${route.routeID}</td>
                    <td>${route.departure}</td>
                    <td>${route.destination}</td>
                    <td>${route.date}</td>
                    <td>${route.time}</td>
                    <td>${route.number_of_seat}</td>
                </tr>`;
                cursor.continue();
            } else {
                routesHTML += "</table>";
                routeListDiv.innerHTML = routesHTML;
            }
        };

        request.onerror = () => {
            alert("Error retrieving routes.");
        };
    }

    // Search routes based on input criteria
    function searchRoutes() {
        const routeIDVal = document.getElementById("routeID").value.trim();
        const departureVal = document.getElementById("departure").value.trim().toLowerCase();
        const destinationVal = document.getElementById("destination").value.trim().toLowerCase();
        const dateVal = document.getElementById("date").value.trim();
        const timeVal = document.getElementById("time").value.trim();
        const numberSeatVal = document.getElementById("number_of_seat").value.trim();

        const routeListDiv = document.getElementById("routeList");
        routeListDiv.innerHTML = "";

        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.openCursor();
        let routesHTML = "<table>";
        routesHTML += "<tr><th>Route ID</th><th>Departure</th><th>Destination</th><th>Date</th><th>Time</th><th>Seats</th></tr>";
        let foundMatch = false; // Flag to track if any route is found

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const route = cursor.value;
                let match = true;
                if (routeIDVal && route.routeID !== parseInt(routeIDVal)) match = false;
                if (departureVal && !route.departure.toLowerCase().includes(departureVal)) match = false;
                if (destinationVal && !route.destination.toLowerCase().includes(destinationVal)) match = false;
                if (dateVal && route.date !== dateVal) match = false;
                if (timeVal && route.time !== timeVal) match = false;
                if (numberSeatVal && route.number_of_seat !== parseInt(numberSeatVal)) match = false;
                if (match) {
                    foundMatch = true;
                    routesHTML += `<tr>
                        <td>${route.routeID}</td>
                        <td>${route.departure}</td>
                        <td>${route.destination}</td>
                        <td>${route.date}</td>
                        <td>${route.time}</td>
                        <td>${route.number_of_seat}</td>
                    </tr>`;
                }
                cursor.continue();
            } else {
                routesHTML += "</table>";
                routeListDiv.innerHTML = routesHTML;
                // Alert user based on search results
                if (foundMatch) {
                    alert("Routes found!");
                } else {
                    alert("No routes found.");
                }
                clearInputs(); // Clear inputs after search
            }
        };

        request.onerror = () => {
            alert("Error searching routes.");
        };
    }

    document.addEventListener("DOMContentLoaded", () => {
        openDB()
            .then(() => {
                displayRoutes();
            })
            .catch((err) => {
                console.error(err);
            });

        document.getElementById("createBtn").addEventListener("click", createRoute);
        document.getElementById("searchBtn").addEventListener("click", searchRoutes);
        document.getElementById("updateBtn").addEventListener("click", updateRoute);
        document.getElementById("deleteBtn").addEventListener("click", deleteRoute);
    });
})();
