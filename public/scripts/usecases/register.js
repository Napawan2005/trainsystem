// register.js
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
                    // Create an index on username to ensure uniqueness
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

            // Check if the form is in Register mode by looking at the password-confirm field's display property
            const passwordConfirmGroup = document.getElementById("password-confirm-group");
            if (passwordConfirmGroup.style.display !== "none") {
                const username = document.getElementById("username").value.trim();
                const password = document.getElementById("password").value;
                const passwordConfirm = document.getElementById("password-confirm").value;

                // Validate that both password fields match
                if (password !== passwordConfirm) {
                    alert("Passwords do not match!");
                    return;
                }

                try {
                    const db = await openDB();
                    const tx = db.transaction(tableName, "readwrite");
                    const store = tx.objectStore(tableName);
                    // Use the index to check if username already exists
                    const index = store.index("username");
                    const getRequest = index.get(username);

                    getRequest.onsuccess = () => {
                        if (getRequest.result) {
                            alert("User already exists!");
                        } else {
                            // Determine role: if username starts with "admin-" then role = "admin", otherwise "user"
                            const role = username.startsWith("admin-") ? "admin" : "user";
                            const newUser = { username, password, role };
                            const addRequest = store.add(newUser);

                            addRequest.onsuccess = (event) => {
                                // Auto-generated userID from the add operation
                                newUser.userID = event.target.result;
                                alert("Registration successful!");
                                // Store logged in user details in session storage
                                sessionStorage.setItem("loggedInUser", JSON.stringify(newUser));
                                if (newUser.role === "admin") {
                                    window.location.href = "/src/admin/crud-route.html";
                                } else {
                                    window.location.href = "/src/usecases/booking.html";
                                }
                            };

                            addRequest.onerror = () => {
                                alert("Error creating user. Please try again.");
                            };
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
