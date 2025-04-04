// buy-history.js
(() => {
    document.addEventListener("DOMContentLoaded", () => {
        // Retrieve logged-in user from sessionStorage
        const loggedInUserJSON = sessionStorage.getItem("loggedInUser");
        if (!loggedInUserJSON) {
            alert("You are not logged in. Redirecting to login page.");
            window.location.href = "/index.html";
            return;
        }

        let user;
        try {
            user = JSON.parse(loggedInUserJSON);
        } catch (error) {
            console.error("Error parsing loggedInUser:", error);
            alert("Session error. Please log in again.");
            window.location.href = "/index.html";
            return;
        }

        // Fetch and display tickets for this user
        fetchUserTickets(user.userID);
    });

    function fetchUserTickets(userID) {
        const request = indexedDB.open("TicketDB", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("tickets", "readonly");
            const store = tx.objectStore("tickets");
            const cursorRequest = store.openCursor();
            const tickets = [];

            cursorRequest.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    const ticket = cursor.value;
                    // Filter tickets by logged-in user's userID
                    if (ticket.userID === userID) {
                        tickets.push(ticket);
                    }
                    cursor.continue();
                } else {
                    renderTickets(tickets);
                }
            };

            cursorRequest.onerror = () => {
                alert("Error reading ticket records.");
            };
        };

        request.onerror = (event) => {
            alert("Error opening TicketDB: " + event.target.errorCode);
        };
    }

    function renderTickets(tickets) {
        const container = document.getElementById("history-container");
        if (tickets.length === 0) {
            container.innerHTML = "<p>You have not purchased any tickets yet.</p>";
            return;
        }
        let html = "<table>";
        html += `
      <tr>
        <th>Ticket ID</th>
        <th>Route ID</th>
        <th>Seats Taken</th>
        <th>Seat Names</th>
        <th>Total Price</th>
      </tr>
    `;
        tickets.forEach(ticket => {
            html += `<tr>
                <td>${ticket.ticketID}</td>
                <td>${ticket.routeID}</td>
                <td>${ticket.seatTaken}</td>
                <td>${ticket.seatName.map(seat => seat.seatId).join(", ")}</td>
                <td>$${ticket.totalPrice.toFixed(2)}</td>
              </tr>`;
        });
        html += "</table>";
        container.innerHTML = html;
    }
})();
