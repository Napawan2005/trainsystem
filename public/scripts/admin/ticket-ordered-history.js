// ticket-ordered-history.js
(() => {
    let db;

    // Open TicketDB
    function openTicketDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("TicketDB", 1);
            request.onerror = (event) => reject("TicketDB error: " + event.target.errorCode);
            request.onsuccess = (event) => resolve(event.target.result);
            // Assume TicketDB is already created by initial-db.js
        });
    }

    // Search and display tickets
    async function searchTickets() {
        try {
            db = await openTicketDB();
            const transaction = db.transaction(["tickets"], "readonly");
            const store = transaction.objectStore("tickets");
            const request = store.openCursor();
            let tickets = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    tickets.push(cursor.value);
                    cursor.continue();
                } else {
                    // When all records are collected, filter based on search criteria
                    const filteredTickets = filterTickets(tickets);
                    renderTickets(filteredTickets);
                }
            };

            request.onerror = () => {
                alert("Error retrieving tickets.");
            };
        } catch (error) {
            console.error("Error opening TicketDB:", error);
        }
    }

    // Filter tickets based on search inputs
    function filterTickets(tickets) {
        const ticketIDVal = document.getElementById("ticketID").value.trim();
        const routeIDVal = document.getElementById("routeID").value.trim();
        const userIDVal = document.getElementById("userID").value.trim();
        const totalPriceVal = document.getElementById("totalPrice").value.trim();
        const seatFilterVal = document.getElementById("seatFilter").value.trim().toLowerCase();

        // If all filters are empty, return all tickets
        if (!ticketIDVal && !routeIDVal && !userIDVal && !totalPriceVal && !seatFilterVal) {
            return tickets;
        }

        return tickets.filter(ticket => {
            let match = true;
            if (ticketIDVal && ticket.ticketID !== parseInt(ticketIDVal)) match = false;
            if (routeIDVal && ticket.routeID !== parseInt(routeIDVal)) match = false;
            if (userIDVal && ticket.userID !== parseInt(userIDVal)) match = false;
            if (totalPriceVal && ticket.totalPrice !== parseFloat(totalPriceVal)) match = false;
            // For seatFilter, search within the seatName array (stringify each seat)
            if (seatFilterVal) {
                const seatString = JSON.stringify(ticket.seatName).toLowerCase();
                if (!seatString.includes(seatFilterVal)) match = false;
            }
            return match;
        });
    }

    // Render tickets in a table format
    function renderTickets(tickets) {
        const ticketListDiv = document.getElementById("ticketList");
        let html = "<table>";
        html += `<tr>
      <th>Ticket ID</th>
      <th>Route ID</th>
      <th>User ID</th>
      <th>Seats Taken</th>
      <th>Seat Names</th>
      <th>Total Price</th>
    </tr>`;
        if (tickets.length === 0) {
            html += "<tr><td colspan='6'>No tickets found.</td></tr>";
        } else {
            tickets.forEach(ticket => {
                html += `<tr>
          <td>${ticket.ticketID}</td>
          <td>${ticket.routeID}</td>
          <td>${ticket.userID || "N/A"}</td>
          <td>${ticket.seatTaken}</td>
          <td>${ticket.seatName.map(seat => seat.seatId).join(", ")}</td>
          <td>$${ticket.totalPrice.toFixed(2)}</td>
        </tr>`;
            });
        }
        html += "</table>";
        ticketListDiv.innerHTML = html;
    }

    // Set up event listeners on DOM load
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("searchBtn").addEventListener("click", searchTickets);
        // On load, also display all tickets if desired:
        searchTickets();
    });
})();
