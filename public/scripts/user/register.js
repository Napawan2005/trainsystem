// register.js
(() => {
    const dbName = "UserDB";;
    const tableName = "users";

    // Open IndexedDB connection and create object store if needed
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onerror = (event) => reject("Database error: " + event.target.errorCode);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objecttableNames.contains(tableName)) {
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

            // Check if the form is in Register mode by looking at the password-confirm field's display property
            const passwordConfirmGroup = document.getElementById("password-confirm-group");
            if (passwordConfirmGroup.style.display !== "none") {
                const username = document.getElementById("username").value.trim();
                const password = document.getElementById("password").value;
                const passwordConfirm = document.getElementById("passwordConfirm").value;

                // Validate that both password fields match
                if (password !== passwordConfirm) {
                    alert("Passwords do not match!");
                    return;
                }

                try {
                    const db = await openDB();
                    const tx = db.transaction(tableName, "readwrite");
                    const store = tx.objectStore(tableName);
                    const getRequest = store.get(username);

                    getRequest.onsuccess = () => {
                        if (getRequest.result) {
                            alert("User already exists!");
                        } else {
                            // Store the new user credentials
                            store.add({ username, password });
                            tx.oncomplete = () => {
                                alert("Registration successful!");
                                // Set session with the logged in username
                                sessionStorage.setItem("loggedInUser", username);
                                if (username == "admin") {
                                    window.location.href = "admin.html";
                                    alert("Login successful! Redirecting to admin page."); // Redirect to admin page
                                } else {
                                    window.location.href = "booking.html";
                                    alert("Login successful! Redirecting to booking page."); // Redirect to booking page
                                }
                            }
                        }
                    };

                    getRequest.onerror = () => {
                        console.error("Error checking if user exists");
                    };
                } catch (err) {
                    console.error("Error accessing database:", err);
                }
            }
        });
    });
})();
