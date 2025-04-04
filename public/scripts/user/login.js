// login.js
(() => {
    const dbName = "UserDB";
    const tableName = "users";

    // Open IndexedDB connection and create object store if needed
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onerror = (event) => reject("Database error: " + event.target.errorCode);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(tableName)) {
                    db.createObjectStore(tableName, { keyPath: "username" });
                }
            };
            request.onsuccess = (event) => resolve(event.target.result);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const authForm = document.getElementById("authForm");

        authForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // If the Confirm Password field is hidden, we assume the form is in Login mode.
            const passwordConfirmGroup = document.getElementById("password-confirm-group");
            if (passwordConfirmGroup.style.display === "none") {
                const username = document.getElementById("username").value.trim();
                const password = document.getElementById("password").value;

                try {
                    const db = await openDB();
                    const tx = db.transaction(tableName, "readonly");
                    const store = tx.objectStore(tableName);
                    const getRequest = store.get(username);

                    getRequest.onsuccess = () => {
                        const user = getRequest.result;
                        if (!user) {
                            alert("User not found!");
                        } else if (user.password !== password) {
                            alert("Incorrect password!");
                        } else {
                            alert("Login successful!");
                            // Set session with the logged in username
                            sessionStorage.setItem("loggedInUser", username);

                            if (username =="admin") {
                                window.location.href = "admin.html";
                                alert("Login successful! Redirecting to admin page."); // Redirect to admin page
                            } else {
                                window.location.href = "booking.html";
                                alert("Login successful! Redirecting to booking page."); // Redirect to booking page
                            }
                        }
                    };

                    getRequest.onerror = () => {
                        console.error("Error retrieving user data");
                    };
                } catch (err) {
                    console.error("Error accessing database:", err);
                }
            }
        });
    });
})();
