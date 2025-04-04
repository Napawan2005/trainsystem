// seat-select.js
(() => {
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

    // Get seat price from SeatClassDB for a given seat class
    function getSeatPrice(seatClass) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("SeatClassDB", 1);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const tx = db.transaction("seatClass", "readonly");
                const store = tx.objectStore("seatClass");
                const getRequest = store.get(seatClass);
                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        resolve(getRequest.result.price);
                    } else {
                        resolve(0);
                    }
                };
                getRequest.onerror = () => {
                    reject("Error retrieving price for class " + seatClass);
                };
            };
            request.onerror = () => {
                reject("Error opening SeatClassDB");
            };
        });
    }

    // Render seat summary (selected seats list and total price)
    function renderSelectedSeats() {
        const selectedSeats = JSON.parse(sessionStorage.getItem("selectSeatSS"));
        const summaryContainer = document.getElementById("selected-seats");
        const totalPriceElem = document.getElementById("total-price");

        // Clear existing summary
        summaryContainer.innerHTML = "";

        // For each selected seat, retrieve its price from SeatClassDB and then update summary
        const pricePromises = selectedSeats.map((seat) =>
            getSeatPrice(seat.seatClass).then((price) => {
                return { seat, price };
            })
        );

        Promise.all(pricePromises)
            .then((results) => {
                let totalPrice = 0;
                results.forEach((item) => {
                    totalPrice += item.price;
                    const seatItem = document.createElement("div");
                    seatItem.textContent = `${item.seat.seatId} (Class ${item.seat.seatClass}) - $${item.price}`;
                    summaryContainer.appendChild(seatItem);

                    // Mark seat as selected (in case user refreshed)
                    const seatBtn = document.querySelector(`[data-seat="${item.seat.seatId}"]`);
                    if (seatBtn) {
                        seatBtn.classList.add("selected");
                    }
                });
                totalPriceElem.textContent = totalPrice;
                sessionStorage.setItem("totalPrice", totalPrice.toString());
            })
            .catch((error) => {
                console.error("Error calculating seat prices:", error);
            });
    }
})();
