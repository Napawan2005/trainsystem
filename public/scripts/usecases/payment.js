// payment.js
(() => {
    document.addEventListener("DOMContentLoaded", () => {
        // Retrieve lang-swap-data from sessionStorage
        const routeID = sessionStorage.getItem("userSelectRouteID");
        const seatArray = JSON.parse(sessionStorage.getItem("selectSeatSS") || "[]");
        const subtotal = parseFloat(sessionStorage.getItem("totalPrice") || "0");

        // If no booking lang-swap-data is available, redirect back to seat-select page.
        if (!routeID || seatArray.length === 0) {
            alert("No booking lang-swap-data found. Redirecting...");
            window.location.href = "/src/usecases/seat-select.html";
            return;
        }

        // Calculate VAT (7%) and final total
        const vatAmount = +(subtotal * 0.07).toFixed(2);
        const finalTotal = +(subtotal + vatAmount).toFixed(2);

        // Render booking summary information
        renderBookingDetails(routeID, seatArray, subtotal, vatAmount, finalTotal);

        // Attach event listener for Cancel button → redirect back to seat-select.html
        document.getElementById("cancel-btn").addEventListener("click", () => {
            window.location.href = "/src/usecases/seat-select.html";
        });

        // Attach event listener for Confirm button → insert record into TicketDB
        document.getElementById("confirm-btn").addEventListener("click", () => {
            // Ensure there is booking lang-swap-data
            if (seatArray.length === 0) {
                alert("No seats selected. Please select at least one seat before confirming.");
                return;
            }
            confirmPayment(routeID, seatArray, finalTotal);
        });
    });

    // Render booking details on the payment page
    function renderBookingDetails(routeID, seatArray, subtotal, vatAmount, finalTotal) {
        const bookingDetailsDiv = document.getElementById("booking-details");
        const subtotalElem = document.getElementById("subtotal");
        const vatElem = document.getElementById("vat-amount");
        const finalTotalElem = document.getElementById("final-total");

        // Build booking details HTML
        let detailsHTML = `<p>Route ID: ${routeID}</p>`;
        detailsHTML += "<p>Selected Seats:</p>";
        seatArray.forEach((seat) => {
            detailsHTML += `<div>- ${seat.seatId} (Class ${seat.seatClass})</div>`;
        });
        bookingDetailsDiv.innerHTML = detailsHTML;

        // Display price calculations
        subtotalElem.textContent = subtotal.toFixed(2);
        vatElem.textContent = vatAmount.toFixed(2);
        finalTotalElem.textContent = finalTotal.toFixed(2);
    }

    // Confirm payment and insert record into TicketDB
    function confirmPayment(routeID, seatArray, finalTotal) {
        // Retrieve logged in user (if any) from sessionStorage
        const loggedInUserJSON = sessionStorage.getItem("loggedInUser");
        let userID = null;
        if (loggedInUserJSON) {
            try {
                const userObj = JSON.parse(loggedInUserJSON);
                userID = userObj.userID;
            } catch (error) {
                console.error("Error parsing loggedInUser:", error);
            }
        }

        // Open TicketDB and add a new ticket record
        const request = indexedDB.open("TicketDB", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("tickets", "readwrite");
            const store = tx.objectStore("tickets");

            // Construct the new ticket record
            const newTicket = {
                routeID: parseInt(routeID),
                userID: userID || null, // Use null or guest if no user logged in
                seatTaken: seatArray.length,
                seatName: seatArray,    // Store the array of seat objects
                totalPrice: finalTotal, // Final total including VAT
            };

            const addRequest = store.add(newTicket);
            addRequest.onsuccess = () => {
                alert("Payment confirmed! Your ticket has been saved.");
                // Optionally, clear booking lang-swap-data from sessionStorage
                sessionStorage.removeItem("selectSeatSS");
                sessionStorage.removeItem("totalPrice");
                // Redirect to a confirmation or home page
                window.location.href = "/src/user/buy-history.html";
            };
            addRequest.onerror = () => {
                alert("Error storing ticket. Please try again.");
            };
        };
        request.onerror = () => {
            alert("Error opening TicketDB.");
        };
    }
})();
