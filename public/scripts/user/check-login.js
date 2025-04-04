// check-login.js
(() => {
    document.addEventListener("DOMContentLoaded", () => {
        const loggedInUserJSON = sessionStorage.getItem("loggedInUser");
        if (!loggedInUserJSON) {
            alert("You must be logged in to view this page.");
            window.location.href = "/index.html"; // Update with your login page URL if needed
        }
    });
})();
