# Go to Heaven Project

Welcome to the **Go to Heaven Project**! This project is a web-based application that manages routes, users, ticket purchases, and seat selections for a travel booking system. It uses **Vite** as the build tool and vanilla JavaScript for functionality.

---

## Features

- **Admin Dashboard:**  
  - Create, update, search, and delete routes.  
  - Manage users and view ticket purchase history.  
  - Update seat class prices via an admin interface.
  
- **User Booking Flow:**  
  - Search available routes with dynamic seat availability calculation.  
  - Select seats with live price updates (including VAT).  
  - Payment page for confirming booking and storing ticket purchase history.
  
- **Data Storage:**  
  - Uses IndexedDB for storing data across four databases:  
    - **RouteDB**: Stores route information.  
    - **UserDB**: Manages user credentials and roles.  
    - **TicketDB**: Records ticket purchase history.  
    - **SeatClassDB**: Manages seat class prices.
    
- **Session Management:**  
  - Uses `sessionStorage` to manage the logged-in user, selected route, seat selections, and total price.

---

## Prerequisites

- **Node.js** (v12 or above) and **npm** installed on your machine.

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/go-to-heaven-project.git
   cd go-to-heaven-project
   ```

2. **Install Dependencies:**

   This project uses Vite for development. Install the necessary dependencies by running:

   ```bash
   npm install
   ```

3. **Run the Development Server:**

   Start the Vite development server with:

   ```bash
   npm run dev
   ```

   Vite will start a local development server (usually on [http://localhost:3000](http://localhost:3000)). Open this URL in your browser to see the project in action.

4. **Build for Production:**

   To build the project for production, run:

   ```bash
   npm run build
   ```

   This will generate a `dist` folder containing the production-ready files.

5. **Preview the Production Build:**

   You can preview the production build locally with:

   ```bash
   npm run preview
   ```

---

## Project Structure

- **src/**: Contains all source files.
  - **index.html**: Main landing page.
  - **booking.html**: User booking page.
  - **seat-select.html**: Seat selection page.
  - **payment.html**: Payment page.
  - **ticket-ordered.html**: Admin ticket history page.
  - **edit-seat.html**: Admin seat price update page.
  - **buy-history.html**: User ticket purchase history page.
- **src/scripts/**: Contains JavaScript modules.
  - **admin/**: Contains admin-specific scripts (e.g., `admin-auth.js`, `admins.js`, `edit-seat.js`).
  - **user/**: Contains user-specific scripts (e.g., `logout.js`, `check-login.js`).
  - **booking.js, seat-select.js, payment.js, ticket-ordered.js, buy-history.js**: Feature-specific modules.
  - **initial-db.js**: Script for initializing the IndexedDB databases.
- **src/styles/**: Contains CSS files for styling each page.

---

## Additional Information

- **Vite Configuration:**  
  Vite uses ES modules by default. No additional configuration is required unless you need to customize the build settings. Refer to [Vite's official documentation](https://vitejs.dev/config/) for more details.

- **Browser Compatibility:**  
  This project uses modern JavaScript (ES6+) and IndexedDB. It is recommended to run it in modern browsers like Chrome, Firefox, Edge, or Safari.

- **Debugging:**  
  Use your browser's Developer Tools to inspect IndexedDB, sessionStorage, and console logs for debugging purposes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
