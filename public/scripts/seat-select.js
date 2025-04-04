// seat-select.js
(() => {
    // Hardcoded seat price mapping (A: 300, B: 200, C: 100)
    const seatPriceMap = {
        A: 300,
        B: 200,
        C: 100,
    };

    // Ensure selectSeatSS is initialized in sessionStorage as an array of objects
    // Each object: { seatId: "SA1", seatClass: "A" }
    if (!sessionStorage.getItem("selectSeatSS")) {
        sessionStorage.setItem("selectSeatSS", JSON.stringify([]));
    }
    // Also store totalPrice in sessionStorage
    if (!sessionStorage.getItem("totalPrice")) {
        sessionStorage.setItem("totalPrice", "0");
    }

    document.addEventListener("DOMContentLoaded", () => {
        // Check if a route has been selected; if not, redirect to booking page
        const selectedRouteID = sessionStorage.getItem("userSelectRouteID");
        if (!selectedRouteID) {
            alert("No route selected. Redirecting to booking page.");
            window.location.href = "booking.html";
            return;
        }

        // Load and display route information in the header
        loadRouteInfo(selectedRouteID);

        // Render any already selected seats (in case user navigated away and came back)
        renderSelectedSeats();

        // Add click event listeners to all seat buttons
        const seatButtons = document.querySelectorAll(".seat");
        seatButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                toggleSeatSelection(btn);
            });
        });

        // Attach event listener to Confirm Button
        const confirmBtn = document.getElementById("confirm-btn");
        confirmBtn.addEventListener("click", () => {
            // Ensure at least one seat is selected before proceeding
            const selectedSeats = JSON.parse(sessionStorage.getItem("selectSeatSS"));
            if (selectedSeats.length === 0) {
                alert("Please select at least one seat before confirming.");
                return;
            }
            // Redirect to payment page
            window.location.href = "payment.html";
        });
    });

    // Load route information from RouteDB and display in header div "route-info"
    function loadRouteInfo(routeID) {
        const request = indexedDB.open("RouteDB", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction("routes", "readonly");
            const store = tx.objectStore("routes");
            const getRequest = store.get(Number(routeID));
            getRequest.onsuccess = () => {
                const route = getRequest.result;
                if (route) {
                    document.getElementById("departure").textContent = route.departure;
                    document.getElementById("destination").textContent = route.destination;
                    document.getElementById("date").textContent = route.date;
                    document.getElementById("time").textContent = route.time;
                } else {
                    document.getElementById("departure").textContent = "N/A";
                    document.getElementById("destination").textContent = "N/A";
                    document.getElementById("date").textContent = "N/A";
                    document.getElementById("time").textContent = "N/A";
                }
            };
            getRequest.onerror = () => {
                console.error("Error retrieving route info");
            };
        };
        request.onerror = () => {
            console.error("Error opening RouteDB");
        };
    }

    // Toggle selection state for a seat button
    function toggleSeatSelection(button) {
        const seatId = button.dataset.seat;
        const seatClass = button.dataset.class;
        let selectedSeats = JSON.parse(sessionStorage.getItem("selectSeatSS"));

        // Check if seat is already selected
        const existingIndex = selectedSeats.findIndex((s) => s.seatId === seatId);
        if (existingIndex !== -1) {
            // Unselect: remove from array
            selectedSeats.splice(existingIndex, 1);
            button.classList.remove("selected");
        } else {
            // Select: add to array
            selectedSeats.push({ seatId, seatClass });
            button.classList.add("selected");
        }

        // Update sessionStorage
        sessionStorage.setItem("selectSeatSS", JSON.stringify(selectedSeats));

        // Re-render the seat summary
        renderSelectedSeats();
    }

    // Render seat summary (selected seats list and total price)
    function renderSelectedSeats() {
        const selectedSeats = JSON.parse(sessionStorage.getItem("selectSeatSS"));
        const summaryContainer = document.getElementById("selected-seats");
        const totalPriceElem = document.getElementById("total-price");

        // Clear existing summary
        summaryContainer.innerHTML = "";

        // Calculate total price
        let totalPrice = 0;
        selectedSeats.forEach((seat) => {
            const seatItem = document.createElement("div");
            const seatCost = seatPriceMap[seat.seatClass] || 0;
            totalPrice += seatCost;
            seatItem.textContent = `${seat.seatId} (Class ${seat.seatClass}) - $${seatCost}`;
            summaryContainer.appendChild(seatItem);

            // Also mark seat as selected in case user refreshes
            const seatBtn = document.querySelector(`[data-seat="${seat.seatId}"]`);
            if (seatBtn) {
                seatBtn.classList.add("selected");
            }
        });

        totalPriceElem.textContent = totalPrice;
        sessionStorage.setItem("totalPrice", totalPrice.toString());
    }
})();
