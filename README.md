# Expense Tracker API

## Project Overview

This is a simple Express.js backend API for tracking personal expenses, featuring JWT authentication, Prisma ORM integration, and SQLite database management. The application provides a secure and efficient way to manage and record personal expenses.

## Tech Stack

- **Backend Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Argon2

## Prerequisites

- Node.js (v16 or later)
- npm (Node Package Manager)

## Features

- User Registration and Authentication
- Secure Password Storage
- Create and Retrieve Expenses
- JWT-based Protected Routes
- Logging Middleware

## Project Structure

```
expense-tracker-api/
│
├── prisma/                # Prisma database schema and migrations
│   └── schema.prisma
│
├── src/
│   ├── app.js             # Express application configuration
│   ├── index.js           # Server entry point
│   ├── config/            # Configuration files
│   ├── controllers/       # Route logic and request handling
│   ├── middlewares/       # Custom middleware (auth, logging)
│   ├── routes/            # API route definitions
│   └── utils/             # Utility functions
│
├── package.json           # Project metadata and dependencies
└── env.txt                # Environment configuration template
```

## Database Schema

### User Model

- `id`: Unique UUID
- `email`: Unique user email
- `password`: Hashed user password
- Relation: One-to-Many with Expenses

### Expense Model

- `id`: Unique UUID
- `amount`: Expense amount
- `category`: Expense category
- `createdAt`: Timestamp of expense creation
- `userId`: Foreign key linking to User

## Setup and Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/expense-tracker-api.git
   cd expense-tracker-api
   ```

2. Install Dependencies

   ```bash
   npm install
   ```

3. Set up Environment Variables

   - Copy `env.txt` to `.env`
   - Fill in required environment variables
     ```
     DATABASE_URL=file:./dev.db
     JWT_SECRET=your_secret_key
     ```

4. Initialize Database

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the Application
   ```bash
   # Development mode
   npm run dev
   ```

## API Endpoints

### Authentication Routes

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate user and generate JWT token
- `POST /api/auth/logout`: Logout user

### Expense Routes

- `GET /api/expenses`: Retrieve all expenses for the authenticated user
- `POST /api/expenses`: Create a new expense for the authenticated user

## Authentication Flow

1. Register a new user
2. Login to receive a JWT token
3. Include token in `Authorization` header for protected routes

## Development Scripts

- `npm run dev`: Start development server with nodemon
- `npx prisma studio`: Open Prisma database management UI

## Security Practices

- JWT for authentication
- Argon2 for password hashing
- Protected routes middleware
- Environment-based configuration

## Potential Improvements

- Implement more comprehensive error handling
- Add pagination for expense retrieval
- Create expense filtering and sorting capabilities

## License

ISC License

## Author

Vivek Kumar

---

**Note**: This is a personal project and serves as a learning exercise in building RESTful APIs with modern web technologies. **It is strictly not ready for production**.
