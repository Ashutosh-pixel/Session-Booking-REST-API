# Session Booking REST API

A backend REST API for a teacher-student session booking platform built with Node.js, TypeScript, Express.js, MongoDB, and Mongoose.

## Tech Stack

* **Runtime & Framework:** Node.js, Express.js, TypeScript
* **Database & ODM:** MongoDB, Mongoose

## Prerequisites

* Node.js (v22+ recommended)
* MongoDB (Local instance or MongoDB Atlas URI)

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ashutosh-pixel/Session-Booking-REST-API.git
   cd Session-Booking-REST-API
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/assignment
   ```

4. **Run the application:**
     ```bash
     npm run dev
     ```

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/users` | Create a new user (unique email required) |
| `POST` | `/teachers` | Create a new teacher (unique email required) |
| `POST` | `/sessions` | Create an available session for a teacher |
| `GET` | `/sessions/available?dateTimestamp={ts}` | Get available sessions for a specific date (Aggregation Pipeline) |
| `POST` | `/sessions/:id/book` | Book an available session for a user |
| `PATCH` | `/sessions/:id/complete` | Mark a booked session as completed |
| `GET` | `/users/:id/sessions` | Get user's upcoming and completed sessions (Aggregation Pipeline) |

## API Testing

Import the included Postman collection JSON file into Postman to test all endpoints, edge cases, and validation rules.