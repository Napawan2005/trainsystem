(() => {
    // Retrieve the logged-in user data from session storage using the correct key
    const loggedInUserJSON = sessionStorage.getItem("loggedInUser");

    // If there's no logged in user, deny access and redirect to login page
    if (!loggedInUserJSON) {
        alert("Access denied. You must be logged in as an admin to access this page.");
        window.location.href = "/login.html"; // Change to your actual login page URL
        return;
    }

    let loggedInUser;
    try {
        loggedInUser = JSON.parse(loggedInUserJSON);
    } catch (error) {
        console.error("Error parsing logged in user data:", error);
        alert("Invalid session data. Please log in again.");
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "/login.html";
        return;
    }

    // Check if the user's role is admin (using toLowerCase for consistency)
    if (loggedInUser.role.toLowerCase() !== "admin") {
        alert("Access denied. Admins only.");
        window.location.href = "/login.html"; // Redirect non-admin users to login page
        return;
    }

    // If the code reaches here, the user is an admin
    console.log("Admin authenticated successfully.");
})();
