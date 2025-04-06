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
                    let store = db.createObjectStore(tableName, { keyPath: "userID", autoIncrement: true });
                    store.createIndex("username", "username", { unique: true });
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
                    // Use the username index to retrieve the user record
                    const index = store.index("username");
                    const getRequest = index.get(username);

                    getRequest.onsuccess = () => {
                        const user = getRequest.result;
                        if (!user) {
                            alert("User not found!");
                        } else if (user.password !== password) {
                            alert("Incorrect password!");
                        } else {
                            alert("Login successful!");
                            // Store user details (userID, username, role) in session storage
                            sessionStorage.setItem("loggedInUser", JSON.stringify({ userID: user.userID, username: user.username, role: user.role }));
                            if (user.role === "admin") {
                                window.location.href = "/src/admin/crud-route.html";
                            } else {
                                window.location.href = "/src/usecases/booking.html";
                            }
                        }
                    };

                    getRequest.onerror = () => {
                        console.error("Error retrieving user lang-swap-data");
                    };
                } catch (err) {
                    console.error("Error accessing database:", err);
                }
            }
        });
    });
})();
