# TruEstate Sales Management System

## Overview
A full-stack MERN application for managing sales records with advanced filtering, sorting, and pagination capabilities. Designed with a modular architecture separating frontend UI from backend logic.

## Tech Stack
- **Frontend:** React (Vite), CSS Grid/Flexbox
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Deployment:** Vercel (Frontend), Render (Backend)

## Search Implementation Summary
Implemented using MongoDB `$or` operator with `$regex` for case-insensitive matching across "Customer Name" and "Phone Number" fields.

## Filter Implementation Summary
Multi-select filters (Region, Category) use `$in` array operators. Age filtering uses range queries (`$gte`, `$lte`). Filters are stateless and combinable via URL query parameters.

## Sorting Implementation Summary
Dynamic sorting supported for Date, Quantity, and Customer Name using MongoDB `.sort()`. Sort state is preserved during pagination and filtering.

## Pagination Implementation Summary
Server-side pagination using `skip` and `limit`. The frontend calculates total pages based on the total count returned by the API.

## Setup Instructions
**Prerequisites:** Node.js (v14+) and a MongoDB Atlas connection string.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/TruEstate-Assignment.git](https://github.com/YOUR_USERNAME/TruEstate-Assignment.git)
    cd TruEstate-Assignment
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file in /backend with:
    # MONGO_URI=your_mongodb_connection_string
    # PORT=5000
    npm run seed # (Optional) To populate the database
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    # Create a .env file in /frontend with:
    # VITE_API_URL=http://localhost:5000/api/sales
    npm run dev
    ```

4.  **Access the Application**
    Open `http://localhost:5173` in your browser.
