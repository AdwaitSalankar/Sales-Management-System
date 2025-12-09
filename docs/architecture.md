# TruEstate Sales Management System - Architecture Document

## 1. Backend Architecture
The backend is built on a **Layered Architecture** using **Node.js** and **Express.js**. This design promotes separation of concerns, ensuring that routing, business logic, and database interactions are decoupled.

### Key Components:
* **Runtime Environment:** Node.js
* **Framework:** Express.js (RESTful API)
* **Database:** MongoDB (hosted on Atlas) via Mongoose ODM
* **Pattern:** Controller-Service-Data Access (CSD)

### Architectural Layers:
1.  **Entry Point (`index.js`):** Initializes the Express app, configures middleware (CORS, JSON parsing), connects to MongoDB, and mounts routes.
2.  **Routes Layer (`/routes`):** Defines the API endpoints (e.g., `GET /api/sales`). It maps HTTP requests to specific controller functions without containing business logic.
3.  **Controller Layer (`/controllers`):** Handles the HTTP request/response cycle. It extracts query parameters (`req.query`), validates input, calls the necessary service, and sends formatted JSON responses.
4.  **Service Layer (`/services`):** Contains the core business logic. This layer constructs the complex MongoDB queries (Aggregation Pipelines, Regex matching for search, Date formatting) and calculates dynamic statistics (Total Units, Total Amount).
5.  **Data Layer (`/models`):** Defines the Mongoose Schema/Model, enforcing data structure and types (e.g., ensuring `sale.date` is stored as a Date object).

---

## 2. Frontend Architecture
The frontend is a **Single Page Application (SPA)** built with **React.js** (Vite). It utilizes a component-based architecture where the UI is broken down into small, reusable, and independent pieces.

### Key Components:
* **Library:** React 18+
* **Build Tool:** Vite
* **Styling:** CSS3
* **Icons:** Lucide-React

### State Management Strategy:
* **Centralized State:** The main dashboard state (`search`, `filters`, `pagination`, `sorting`) is "lifted up" to the parent `App.jsx` component. This serves as the single source of truth.
* **Prop Drilling:** State setters are passed down to child components (e.g., `FilterDropdowns`, `Pagination`), allowing them to trigger updates in the parent.
* **Effect Hooks:** `useEffect` monitors the `params` state object. Any change to filters or search terms automatically triggers a debounced API call.

---

## 3. Data Flow
The system follows a unidirectional data flow, ensuring predictability and easier debugging.

### Request Lifecycle (Search & Filter Example):
1.  **User Action:** User types "Neha" in the Search Bar.
2.  **State Update:** React state `params.search` updates to "Neha". `params.page` resets to 1.
3.  **Effect Trigger:** `useEffect` detects the state change and invokes the API Service.
4.  **API Request:** Axios sends `GET /api/sales?search=Neha&page=1` to the backend.
5.  **Route Handling:** Express router directs the request to `salesController.js`.
6.  **Query Construction:** `salesService.js` builds a MongoDB query using `$or` and `$regex`.
7.  **Database Execution:** MongoDB executes the query + an aggregation pipeline for stats.
8.  **Response:** Backend returns a JSON object containing `data`, `pagination`, and `stats`.
9.  **UI Render:** React receives the data, updates the `data` state, and the `TransactionTable` component re-renders to show the filtered results.

---

## 4. Folder Structure
The project follows the strict directory structure required by the assignment specifications.

```text
root/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers (salesController.js)
│   │   ├── services/      # Business logic & Query building (salesService.js)
│   │   ├── routes/        # API route definitions (salesRoutes.js)
│   │   └── models/        # Mongoose schemas (Sale.js)
│   ├── index.js       # App entry point
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Sidebar, FilterDropdowns)
│   │   ├── services/      # API integration logic (api.js)
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx       # React entry point
│   ├── public/
│   ├── package.json
│   └── README.md
└── docs/
    └── architecture.md    # System design documentation
