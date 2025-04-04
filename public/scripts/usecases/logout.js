// logout.js
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // Clear the logged in user session
            sessionStorage.removeItem("loggedInUser");
            alert("You have been logged out successfully!");
            // Redirect to the homepage (or login page) after logout
            window.location.href = "/index.html";
        });
    }
});
