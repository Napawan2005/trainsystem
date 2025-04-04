(() => {
    const dbName = "UserDB";
    const storeName = "users";
    let db;

    // Open (or create) the IndexedDB database
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onerror = (event) => reject("Database error: " + event.target.errorCode);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    let store = db.createObjectStore(storeName, { keyPath: "userID", autoIncrement: true });
                    store.createIndex("username", "username", { unique: true });
                }
            };
            request.onsuccess = (event) => resolve(event.target.result);
        });
    }

    // Helper function to clear all input fields
    function clearInputs() {
        document.getElementById("userID").value = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("role").value = ""; // Reset role to default
    }

    // Display all users in the userList div
    function displayUsers() {
        const userListDiv = document.getElementById("userList");
        userListDiv.innerHTML = "";
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.openCursor();
        let usersHTML = "<table>";
        usersHTML += "<tr><th>UserID</th><th>Username</th><th>Password</th><th>Role</th></tr>";

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const user = cursor.value;
                usersHTML += `<tr>
          <td>${user.userID}</td>
          <td>${user.username}</td>
          <td>${user.password}</td>
          <td>${user.role}</td>
        </tr>`;
                cursor.continue();
            } else {
                usersHTML += "</table>";
                userListDiv.innerHTML = usersHTML;
            }
        };

        request.onerror = () => {
            alert("Error retrieving users.");
        };
    }

    // Create a new user record
    function createUser() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        if (!username || !password || !role) {
            alert("Please fill in all fields.");
            return;
        }

        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const newUser = { username, password, role };
        const request = store.add(newUser);

        request.onsuccess = (event) => {
            alert("User created successfully!");
            displayUsers();
            clearInputs();
        };

        request.onerror = () => {
            alert("Error creating user. The user might already exist.");
        };
    }

    // Search users based on provided criteria
    function searchUsers() {
        const userIDVal = document.getElementById("userID").value.trim();
        const usernameVal = document.getElementById("username").value.trim().toLowerCase();
        const passwordVal = document.getElementById("password").value.trim().toLowerCase();
        const roleVal = document.getElementById("role").value.trim().toLowerCase();

        // Remove the condition that stops search if no criteria is entered
        // This way, an empty search will query all users.

        const userListDiv = document.getElementById("userList");
        userListDiv.innerHTML = "";
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.openCursor();
        let usersHTML = "<table>";
        usersHTML += "<tr><th>UserID</th><th>Username</th><th>Password</th><th>Role</th></tr>";
        let foundMatch = false;

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const user = cursor.value;
                let match = true;
                // Check each field only if a value is provided
                if (userIDVal && user.userID !== parseInt(userIDVal)) match = false;
                if (usernameVal && !user.username.toLowerCase().includes(usernameVal)) match = false;
                if (passwordVal && !user.password.toLowerCase().includes(passwordVal)) match = false;
                if (roleVal && !user.role.toLowerCase().includes(roleVal)) match = false;
                if (match) {
                    foundMatch = true;
                    usersHTML += `<tr>
                    <td>${user.userID}</td>
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td>${user.role}</td>
                </tr>`;
                }
                cursor.continue();
            } else {
                usersHTML += "</table>";
                userListDiv.innerHTML = usersHTML;
                alert(foundMatch ? "Users found!" : "No users found.");
                clearInputs();
            }
        };

        request.onerror = () => {
            alert("Error searching users.");
        };
    }


    // Update an existing user record
    function updateUser() {
        const userID = document.getElementById("userID").value;
        if (!userID) {
            alert("UserID is required for update.");
            return;
        }
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const userIdInt = parseInt(userID);
        const getRequest = store.get(userIdInt);

        getRequest.onsuccess = () => {
            const data = getRequest.result;
            if (!data) {
                alert("User not found.");
                return;
            }
            // Update fields if provided, otherwise keep the current value
            data.username = username || data.username;
            data.password = password || data.password;
            data.role = role || data.role;

            const updateRequest = store.put(data);
            updateRequest.onsuccess = () => {
                alert("User updated successfully!");
                displayUsers();
                clearInputs();
            };

            updateRequest.onerror = () => {
                alert("Error updating user.");
            };
        };

        getRequest.onerror = () => {
            alert("Error retrieving user for update.");
        };
    }

    // Delete a user record
    function deleteUser() {
        const userID = document.getElementById("userID").value;
        if (!userID) {
            alert("UserID is required for deletion.");
            return;
        }

        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const deletedUserID = parseInt(userID);
        const deleteRequest = store.delete(deletedUserID);

        deleteRequest.onsuccess = () => {
            // Check if the deleted user is the currently logged in user
            const loggedInUserJSON = sessionStorage.getItem("loggedInUser");
            if (loggedInUserJSON) {
                try {
                    const loggedInUser = JSON.parse(loggedInUserJSON);
                    if (loggedInUser.userID === deletedUserID) {
                        sessionStorage.removeItem("loggedInUser");
                        alert("User deleted successfully! Current user session removed. Redirecting to index page.");
                        window.location.href = "index.html";
                        return;
                    }
                } catch (e) {
                    console.error("Error parsing logged in user session:", e);
                }
            }
            alert("User deleted successfully!");
            displayUsers();
            clearInputs();
        };

        deleteRequest.onerror = () => {
            alert("Error deleting user.");
        };
    }
    document.addEventListener("DOMContentLoaded", () => {
        openDB()
            .then((database) => {
                db = database;
                displayUsers();
            })
            .catch((err) => console.error(err));

        document.getElementById("createBtn").addEventListener("click", createUser);
        document.getElementById("searchBtn").addEventListener("click", searchUsers);
        document.getElementById("updateBtn").addEventListener("click", updateUser);
        document.getElementById("deleteBtn").addEventListener("click", deleteUser);
    });
})();
