# TruEstate Sales Management System

## Overview
A full-stack MERN application for managing sales records with advanced filtering, sorting, and pagination capabilities. Designed with a modular architecture separating frontend UI from backend logic.

## Tech Stack
- **Frontend:** React (Vite), CSS Grid/Flexbox
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)

## Search Implementation Summary
Implemented using MongoDB `$or` operator with `$regex` for case-insensitive matching across "Customer Name" and "Phone Number" fields.

## Filter Implementation Summary
Multi-select filters (Region, Category) use `$in` array operators. Age filtering uses range queries (`$gte`, `$lte`). Filters are stateless and combinable via URL query parameters.

## Sorting Implementation Summary
Dynamic sorting supported for Date, Quantity, and Customer Name using MongoDB `.sort()`. Sort state is preserved during pagination and filtering.

## Pagination Implementation Summary
Server-side pagination using `skip` and `limit`. The frontend calculates total pages based on the total count returned by the API.

## Setup Instructions
1. Clone the repository.
2. **Backend:**
   - `cd backend`
   - `npm install`
   - Create `.env` with `MONGO_URI=your_mongodb_url`
   - `npm start`
3. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`
