# DevBirds API

A Node.js + Express + MongoDB backend for the DevBirds fitness and training management system.

## Features

- 🔐 JWT-based authentication system
- 👥 Role-based access control (Member/Trainer)
- 📋 Plan management (Diet/Workout)
- 💬 Feedback system
- 🔄 Token blacklist for secure logout
- 📅 Date handling in dd-mm-yyyy format
- 🛡️ Protected routes and middleware
- 📝 Input validation and error handling

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd devbirds
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/devbirds
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "member"  // or "trainer"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Logout
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`

### Plans

#### Create Plan (Trainer only)
- **POST** `/api/plans`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Weekly Workout Plan",
    "description": "Full body workout routine",
    "type": "workout",  // or "diet"
    "member": "member_id_here",
    "content": "Detailed workout instructions...",
    "endDate": "31-12-2024"  // dd-mm-yyyy format
  }
  ```

#### Get Trainer's Plans
- **GET** `/api/plans/trainer`
- **Headers:** `Authorization: Bearer <token>`

#### Get Member's Plans
- **GET** `/api/plans/member`
- **Headers:** `Authorization: Bearer <token>`

#### Update Plan (Trainer only)
- **PUT** `/api/plans/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as create plan

#### Delete Plan (Trainer only)
- **DELETE** `/api/plans/:id`
- **Headers:** `Authorization: Bearer <token>`

### Feedback

#### Submit Feedback (Member only)
- **POST** `/api/feedback`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "plan": "plan_id_here",
    "rating": 5,  // 1-5
    "comment": "Great workout plan!"
  }
  ```

#### Get Plan Feedback (Trainer only)
- **GET** `/api/feedback/plan/:planId`
- **Headers:** `Authorization: Bearer <token>`

#### Get All Trainer's Feedback
- **GET** `/api/feedback/trainer`
- **Headers:** `Authorization: Bearer <token>`

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Date Format

All dates in the API are handled in dd-mm-yyyy format:
- Input: "31-12-2024"
- Output: "31-12-2024"

## Error Handling

The API uses consistent error responses with appropriate HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Token blacklist for logout
- Role-based access control
- Input validation
- Protected routes

## Development

### Scripts
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm test`: Run tests (when implemented)

### Project Structure
```
devbirds/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── app.js          # Express app setup
└── package.json    # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 