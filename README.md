# Community Student Progress Tracking System

A full-stack web application for tracking and managing student progress in a learning community. The system allows administrators and mentors to monitor student performance, manage courses, record attendance, and generate reports.

The project uses a **modern architecture** with:

- **Frontend:** Next.js + TailwindCSS  
- **Backend:** Node.js + Express.js (REST API)  
- **Database:** MySQL
- **Real-time:** Socket.io
- **API Documentation:** Swagger UI

---

# Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Development Setup](#development-setup)
- [API Documentation](#api-documentation)
- [Future Improvements](#future-improvements)

---

# Project Overview

The **Community Student Progress Tracking System** is designed to help learning communities, training centers, or educational organizations manage student learning progress.

Users can:

- Register and login (Role-based access: Admin, Teacher, Student)
- Manage students and classes/courses
- Track attendance, assignments, submissions, and grades
- Monitor learning progress and individual goals
- View dynamic analytics dashboards and reports

---

# System Architecture

```text
Browser
  │
  ▼
Next.js Frontend (TailwindCSS)
  │
  ▼
Express.js REST API + Socket.io (Real-time updates)
  │
  ▼
MySQL Database
```

---

# Tech Stack

## Frontend
- Next.js (React Framework)
- TailwindCSS (Styling)
- Axios (HTTP Client)

## Backend
- Node.js & Express.js
- JWT Authentication (`jsonwebtoken`)
- Password Hashing (`bcrypt`, `bcryptjs`)
- Request Validation (`joi`)
- File Uploads (`multer`)
- Real-time Communication (`socket.io`)
- Database Connection (`mysql2`, `sequelize`, `sequelize-cli`)
- API Documentation (`swagger-jsdoc`, `swagger-ui-express`)

## Database
- MySQL (Relational Schema)

---

# Features

## Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin, Teacher, Student)

## Class & User Management
- Add, update, delete students and teachers
- Create and manage classes
- Assign students to specific classes

## Progress & Assignment Tracking
- Create assignments with due dates and maximum scores
- Upload and manage student assignment submissions (via `multer`)
- Grade submissions and provide feedback
- Set and track individual student goals

## Dashboard Analytics
- Admin, Teacher, and Student specific dashboards
- Real-time dynamic calculation of metrics (User Growth, Active Students, Global Submission Rate)
- Activity logs tracking user actions

---

# Project Structure

```text
student-progress-tracker
│
├── frontend
│   ├── src
│   │   ├── app (Next.js Pages & Layouts)
│   │   ├── components (Reusable UI Components)
│   │   ├── hooks (Custom React Hooks)
│   │   ├── lib (Axios config, etc.)
│   │   ├── services (API Service files: adminService.ts, assignmentService.ts, etc.)
│   │   └── styles
│   ├── package.json
│   └── tailwind.config.ts
│
└── backend
    ├── src
    │   ├── app
    │   │   ├── server.js (Express & Socket.io setup)
    │   │   └── routes.js (Main router configuration)
    │   ├── config
    │   │   └── db.js (MySQL connection pool)
    │   ├── modules (Domain-driven architecture)
    │   │   ├── admin, assignments, auth, classes, dashboard, goals, logs, users, etc.
    │   │   └── (Each module contains its own controller, service, repository, routes, and validation)
    │   ├── shared
    │   │   └── middleware (Auth, Error Handling, Validation)
    │   ├── scripts
    │   │   ├── migrate.js (Run database migrations)
    │   │   ├── seed.js (Seed database with initial data)
    │   │   └── reset.js (Reset database schema)
    │   └── docs
    │       └── swagger.js (OpenAPI configuration)
    ├── database
    │   └── schema.sql (Raw SQL schema definition)
    ├── .env.example
    └── package.json
```

---

# Database Schema

Key tables include:
- `users`: Core user accounts (id, username, email, password_hash, role_id)
- `roles`: RBAC roles (admin, teacher, student)
- `user_profiles`: Extended user details (first_name, last_name, avatar_url)
- `classes`: Classes created by teachers
- `enrollments`: Mapping of students to classes
- `assignments`: Assignments linked to specific classes
- `submissions`: Student submissions for assignments
- `grades`: Scores and feedback for submissions
- `goals`: Individual student goals and targets
- `activity_logs`: System audit trail

---

# Development Setup

## 1. Database Setup
Create a local MySQL database and configure your `.env` file in the backend.

## 2. Backend Setup
Navigate to the backend directory, install dependencies, set up the database, and start the server:

```bash
cd backend
npm install

# Configure your .env file before running database scripts
cp .env.example .env

# Initialize database schema
npm run migrate

# (Optional) Seed the database with demo users and roles
npm run seed

# Run the development server (uses nodemon)
npm run dev
```

*Useful Database Commands:*
- `npm run db:reset`: Drops and recreates the database tables from scratch.

## 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the Next.js server:

```bash
cd frontend
npm install
npm run dev
```

Services will run on:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5002 (or as defined in `.env`)

---

# API Documentation

The backend includes auto-generated Swagger OpenAPI documentation. Once the backend server is running, you can view the interactive API docs at:
- **Swagger UI**: `http://localhost:5002/api-docs`

---

# Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5002

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=student_tracking_system

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
```

---

# Future Improvements

- Data visualization charts (e.g. Recharts integration)
- Export reports (PDF / Excel)
- Redis caching for dashboard statistics
- CI/CD pipeline
- Production Docker deployment refinement