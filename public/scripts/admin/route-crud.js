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
                    console.log("Created object store: " + storeName);
                }
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                console.log("Database opened successfully.");
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
    }

    // Create a new route record
    function createRoute() {
        const routeID = document.getElementById("routeID").value;
        const departure = document.getElementById("departure").value;
        const destination = document.getElementById("destination").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        if (!routeID || !departure || !destination || !date || !time) {
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
            number_of_seat: 48 // Default number of seats
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
            // Update values if provided; otherwise, keep current
            data.departure = departure || data.departure;
            data.destination = destination || data.destination;
            data.date = date || data.date;
            data.time = time || data.time;

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
    function displayRoutes() {
        const routeListDiv = document.getElementById("routeList");
        routeListDiv.innerHTML = "";

        // Get input values from all search fields
        const routeIDInput = document.getElementById("routeID").value.trim();
        const departureInput = document.getElementById("departure").value.trim().toLowerCase();
        const destinationInput = document.getElementById("destination").value.trim().toLowerCase();
        const dateInput = document.getElementById("date").value.trim();
        const timeInput = document.getElementById("time").value.trim();

        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);

        // Helper function to render the table header
        const renderHeader = () => {
            return `
      <tr>
        <th>Route ID</th>
        <th>Departure</th>
        <th>Destination</th>
        <th>Date</th>
        <th>Time</th>
        <th>Total Seats</th>
        <th>Available Seats</th>
      </tr>
    `;
        };

        let routesHTML = "<table>" + renderHeader();
        let routePromises = [];

        // Open a cursor to iterate over all routes in the store
        const request = store.openCursor();

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const route = cursor.value;
                let matches = true;

                // Check each input field if provided, and filter accordingly
                if (routeIDInput) {
                    matches = matches && (route.routeID === parseInt(routeIDInput));
                }
                if (departureInput) {
                    matches = matches && route.departure.toLowerCase().includes(departureInput);
                }
                if (destinationInput) {
                    matches = matches && route.destination.toLowerCase().includes(destinationInput);
                }
                if (dateInput) {
                    matches = matches && (route.date === dateInput);
                }
                if (timeInput) {
                    matches = matches && (route.time === timeInput);
                }

                // If the route matches the criteria, add it to the results
                if (matches) {
                    let p = getBookedSeats(route.routeID).then((bookedSeats) => {
                        const available = route.number_of_seat - bookedSeats;
                        return `<tr>
                    <td>${route.routeID}</td>
                    <td>${route.departure}</td>
                    <td>${route.destination}</td>
                    <td>${route.date}</td>
                    <td>${route.time}</td>
                    <td>${route.number_of_seat}</td>
                    <td>${available}</td>
                  </tr>`;
                    });
                    routePromises.push(p);
                }
                cursor.continue();
            } else {
                // Once all routes have been processed, build the table
                Promise.all(routePromises)
                    .then((rows) => {
                        if (rows.length === 0) {
                            routesHTML += `<tr><td colspan="7">No routes found.</td></tr>`;
                        } else {
                            routesHTML += rows.join("");
                        }
                        routesHTML += "</table>";
                        routeListDiv.innerHTML = routesHTML;
                    })
                    .catch((error) => {
                        alert("Error calculating available seats: " + error);
                    });
            }
        };

        request.onerror = () => {
            alert("Error retrieving routes.");
        };
    }

    // Helper function to get the total number of booked seats for a given routeID from TicketDB
    function getBookedSeats(routeID) {
        return new Promise((resolve, reject) => {
            let bookedCount = 0;
            const ticketRequest = indexedDB.open("TicketDB", 1);
            ticketRequest.onsuccess = (event) => {
                const ticketDB = event.target.result;
                const tx = ticketDB.transaction("tickets", "readonly");
                const store = tx.objectStore("tickets");
                const cursorRequest = store.openCursor();
                cursorRequest.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        const ticket = cursor.value;
                        if (ticket.routeID === routeID) {
                            // Prefer seatTaken if available; otherwise, count seats from seatName array.
                            if (ticket.seatTaken) {
                                bookedCount += ticket.seatTaken;
                            } else if (ticket.seatName && Array.isArray(ticket.seatName)) {
                                bookedCount += ticket.seatName.length;
                            }
                        }
                        cursor.continue();
                    } else {
                        resolve(bookedCount);
                    }
                };
                cursorRequest.onerror = () => {
                    reject("Error retrieving tickets.");
                };
            };
            ticketRequest.onerror = () => {
                reject("Error opening TicketDB.");
            };
        });
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
        document.getElementById("searchBtn").addEventListener("click", displayRoutes);
        document.getElementById("updateBtn").addEventListener("click", updateRoute);
        document.getElementById("deleteBtn").addEventListener("click", deleteRoute);
    });
})();
