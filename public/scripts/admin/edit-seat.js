// edit-seat.js
(() => {
    let db;

    // Open SeatClassDB
    function openSeatClassDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("SeatClassDB", 1);
            request.onerror = (event) => reject("Error opening SeatClassDB: " + event.target.errorCode);
            request.onsuccess = (event) => resolve(event.target.result);
            // We assume the seatClass store (keyPath: "class") is already created
        });
    }

    // Retrieve seat class price from the store
    function getSeatClassPrice(className) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction("seatClass", "readonly");
            const store = tx.objectStore("seatClass");
            const getRequest = store.get(className);
            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    resolve(getRequest.result.price);
                } else {
                    reject(`Class ${className} not found`);
                }
            };
            getRequest.onerror = () => reject(`Error retrieving price for class ${className}`);
        });
    }

    // Update seat class price in the store
    function updateSeatClassPrice(className, newPrice) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction("seatClass", "readwrite");
            const store = tx.objectStore("seatClass");
            const getRequest = store.get(className);
            getRequest.onsuccess = () => {
                const record = getRequest.result;
                if (!record) {
                    reject(`Class ${className} not found`);
                    return;
                }
                record.price = newPrice;
                const updateRequest = store.put(record);
                updateRequest.onsuccess = () => resolve(true);
                updateRequest.onerror = () => reject(`Error updating class ${className}`);
            };
            getRequest.onerror = () => reject(`Error retrieving class ${className} for update`);
        });
    }

    // Load current prices for A, B, C
    async function loadPrices() {
        try {
            const [priceA, priceB, priceC] = await Promise.all([
                getSeatClassPrice("A"),
                getSeatClassPrice("B"),
                getSeatClassPrice("C"),
            ]);
            document.getElementById("priceA").textContent = priceA;
            document.getElementById("priceB").textContent = priceB;
            document.getElementById("priceC").textContent = priceC;
        } catch (error) {
            console.error(error);
        }
    }

    // Set up event listeners for update buttons
    function setupUpdateButtons() {
        document.getElementById("updateA").addEventListener("click", async () => {
            const newPrice = document.getElementById("newPriceA").value.trim();
            if (!newPrice) {
                alert("Please enter a valid price for Class A.");
                return;
            }
            try {
                await updateSeatClassPrice("A", parseFloat(newPrice));
                alert("Class A price updated successfully!");
                document.getElementById("newPriceA").value = "";
                loadPrices();
            } catch (error) {
                alert(error);
            }
        });

        document.getElementById("updateB").addEventListener("click", async () => {
            const newPrice = document.getElementById("newPriceB").value.trim();
            if (!newPrice) {
                alert("Please enter a valid price for Class B.");
                return;
            }
            try {
                await updateSeatClassPrice("B", parseFloat(newPrice));
                alert("Class B price updated successfully!");
                document.getElementById("newPriceB").value = "";
                loadPrices();
            } catch (error) {
                alert(error);
            }
        });

        document.getElementById("updateC").addEventListener("click", async () => {
            const newPrice = document.getElementById("newPriceC").value.trim();
            if (!newPrice) {
                alert("Please enter a valid price for Class C.");
                return;
            }
            try {
                await updateSeatClassPrice("C", parseFloat(newPrice));
                alert("Class C price updated successfully!");
                document.getElementById("newPriceC").value = "";
                loadPrices();
            } catch (error) {
                alert(error);
            }
        });
    }

    // On DOMContentLoaded, open DB and load prices
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            db = await openSeatClassDB();
            setupUpdateButtons();
            loadPrices();
        } catch (error) {
            console.error("Error initializing seat class page:", error);
        }
    });
})();
