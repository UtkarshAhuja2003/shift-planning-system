# Shift Planning System

The **Shift Planning System** is a web application built with **Node.js** for the backend and **Next.js** for the frontend. It allows admins to create and assign shifts to employees based on their availability, while converting time between different time zones.

## Features

### User Types:
1. **Admin**
   - Can create shifts for employees.
   - Can view employee availability.
2. **Employees**
   - Can create availability for each day of the week.
   - Can view assigned shifts.

### Main Functionalities:
- **Authentication using JWT**
  - **Login**: `/login`
  - **Register**: `/register`

- **Employee Features:**
  1. **Create Availability** (`/employee/availability`)
     - Employees can input their availability for each day of the week.
     - Availability must be for at least 4 hours daily.
     - Time zone information is managed during creation.
  2. **View Assigned Shifts** (`/employee/shifts`)
     - Employees can view their assigned shifts, including time zone conversions between the admin's and employee's time zones.

- **Admin Features:**
  1. **View Employee Availability** (`/admin/availability`)
     - Admins can view the availability of employees and convert it into different time zones.
  2. **Create Shifts** (`/admin/shifts`)
     - Admins can create shifts for employees based on their availability and the admin’s time zone.
     - The system ensures no shift overlaps occur.

## Installation

1. **Clone the Repository:**
   ```
   git clone https://github.com/UtkarshAhuja2003/shift-planning-system.git
   cd shift-planning-system 
   ```
2. Install Dependencies:

Navigate to the backend and frontend folders and install dependencies for each.
For backend (Node.js):

```
cd backend
npm install
```
For frontend (Next.js):

```
cd frontend
npm install
```
Environment Variables:

Create a .env file in the backend folder with the necessary configurations, such as database URL, JWT secret, etc. by 
```
cp  .env.sample .env
```
Run the Application:

Run the backend:

```
cd backend
npm start
```
Run the frontend:

```
cd frontend
npm run dev
```
Access the Application:

The frontend should be accessible at http://localhost:3000.

## Folder Structure
```
shift-planning-system/
├── backend/
│   ├── controllers/    # Contains logic for authentication, shift, and availability handling
│   ├── models/         # Database models (User, Availability, Shift)
│   ├── routes/         # Express routes for the API
│   ├── middleware/     # JWT and other middleware for security and request handling
│   └── app.js          # Entry point for the backend
│
├── frontend/
│   ├── components/     # Reusable React components
│   ├── pages/          # Next.js pages (login, register, dashboard, etc.)
│   ├── styles/         # CSS/SCSS files for styling
│   └── index.js        # Entry point for the frontend
│
└── README.md           # Project documentation

```
## API Endpoints

### Authentication:

POST /login: Login with credentials.

POST /register: Register a new user.

### Employee Routes:

POST /employee/availability: Create availability.

GET /employee/availability: View availability.

GET /employee/shifts: View assigned shifts.

### Admin Routes:

GET /admin/availability: View employee availability.

POST /admin/shifts: Create shifts for employees.

## Additional Features

Time Zone Conversion: Automatically converts time zones between the employee and the admin during shift creation.