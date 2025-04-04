// booking.js
(() => {
    let routeDB, ticketDB;

    // Open RouteDB (assumes routes are already added via admin pages)
    function openRouteDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("RouteDB", 1);
            request.onerror = (event) => reject("RouteDB error: " + event.target.errorCode);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("routes")) {
                    db.createObjectStore("routes", { keyPath: "routeID" });
                }
            };
        });
    }

    // Open or create TicketDB for Ticket Buy History
    function openTicketDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("TicketDB", 1);
            request.onerror = (event) => reject("TicketDB error: " + event.target.errorCode);
            request.onsuccess = (event) => resolve(event.target.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("tickets")) {
                    db.createObjectStore("tickets", { keyPath: "ticketID", autoIncrement: true });
                }
            };
        });
    }

    // Calculate available seats for a given route
    function getAvailableSeats(routeID, totalSeats) {
        return new Promise((resolve, reject) => {
            let seatsTaken = 0;
            const transaction = ticketDB.transaction(["tickets"], "readonly");
            const store = transaction.objectStore("tickets");
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const ticket = cursor.value;
                    if (ticket.routeID === routeID) {
                        seatsTaken += ticket.seatTaken;
                    }
                    cursor.continue();
                } else {
                    resolve(totalSeats - seatsTaken);
                }
            };
            request.onerror = () => reject("Error calculating available seats");
        });
    }

    // Search routes from RouteDB with available seats, then build results with a Book button.
    async function searchRoutes() {
        const departureInput = document.getElementById("departure").value.trim().toLowerCase();
        const destinationInput = document.getElementById("destination").value.trim().toLowerCase();
        const timeInput = document.getElementById("time").value;

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "Loading...";

        try {
            // Open both databases
            routeDB = await openRouteDB();
            ticketDB = await openTicketDB();

            // Retrieve routes matching criteria
            const routes = [];
            const transaction = routeDB.transaction(["routes"], "readonly");
            const store = transaction.objectStore("routes");
            const request = store.openCursor();

            request.onsuccess = async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const route = cursor.value;
                    let match = true;
                    if (departureInput && !route.departure.toLowerCase().includes(departureInput)) match = false;
                    if (destinationInput && !route.destination.toLowerCase().includes(destinationInput)) match = false;
                    if (timeInput && route.time !== timeInput) match = false;
                    if (match) {
                        routes.push(route);
                    }
                    cursor.continue();
                } else {
                    // Build the results table with an extra "Action" column for the Book button
                    let resultsHTML = "<table>";
                    resultsHTML += "<tr><th>RouteID</th><th>Departure</th><th>Destination</th><th>Date</th><th>Time</th><th>Total Seats</th><th>Available Seats</th><th>Action</th></tr>";

                    for (const route of routes) {
                        const availableSeats = await getAvailableSeats(route.routeID, route.number_of_seat);
                        resultsHTML += `<tr>
              <td>${route.routeID}</td>
              <td>${route.departure}</td>
              <td>${route.destination}</td>
              <td>${route.date}</td>
              <td>${route.time}</td>
              <td>${route.number_of_seat}</td>
              <td>${availableSeats}</td>
              <td>`;
                        if (availableSeats >= 1) {
                            resultsHTML += `<button class="book-btn enabled" onclick="bookRoute(${route.routeID})">Book</button>`;
                        } else {
                            resultsHTML += `<button class="book-btn disabled" disabled>Book</button>`;
                        }
                        resultsHTML += `</td></tr>`;
                    }
                    resultsHTML += "</table>";
                    resultsDiv.innerHTML = resultsHTML || "No routes with available seats found.";
                }
            };

            request.onerror = () => {
                resultsDiv.innerHTML = "Error retrieving routes.";
            };
        } catch (error) {
            resultsDiv.innerHTML = "Error: " + error;
        }
    }

    // Global function to handle booking action.
    window.bookRoute = function (routeID) {
        alert(routeID)
        // Save the selected route in sessionStorage
        sessionStorage.setItem("userSelectRouteID", routeID);
        // Redirect to the seat selection page
        window.location.href = "/src/seat-select.html";
    };

    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("searchBtn").addEventListener("click", searchRoutes);
    });
})();
