# Admin Backend Setup Instructions

## Files Created:
- `src/backend/routes/admin.js` - Admin routes file

## Required Dependencies:

Install bcryptjs for password hashing:
```bash
npm install bcryptjs
```

## Model Path:
Make sure your Admin model path is correct in `src/backend/routes/admin.js` (line 3):
```javascript
const Admin = require('../models/Admin'); // Adjust path if needed
```

## Server Registration:

Add this to your main server file (e.g., `server.js`, `index.js`, or `app.js`):

```javascript
const express = require('express');
const app = express();

// Import admin routes
const adminRoutes = require('./routes/admin'); // Adjust path as needed

// Register the routes
app.use('/api', adminRoutes); // or use your API prefix like '/api/v1'

// Or if you want it at root level:
// app.use('/', adminRoutes);
```

## Available Endpoints:

### 1. GET `/getadmins`
- **Description**: Get all admins
- **Response**: Array of admin objects (password and OTP excluded)
- **Example**: `GET /getadmins`

### 2. GET `/getadmin/:id`
- **Description**: Get single admin by ID
- **Parameters**: `id` (MongoDB ObjectId)
- **Response**: Admin object (password and OTP excluded)
- **Example**: `GET /getadmin/507f1f77bcf86cd799439011`

### 3. POST `/addadmin`
- **Description**: Add new admin
- **Body**: 
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "password123",
    "about": "About admin (optional)",
    "phone": "1234567890 (optional)",
    "address": "Address (optional)",
    "billingpostcode": "12345 (optional)",
    "profilepic": "/avatar.png (optional)"
  }
  ```
- **Required**: `name`, `email`, `password`
- **Response**: Created admin object (password excluded)
- **Example**: `POST /addadmin`

### 4. PUT `/updateadmin/:id`
- **Description**: Update admin
- **Parameters**: `id` (MongoDB ObjectId)
- **Body**: Same as POST, but all fields are optional
- **Response**: Updated admin object (password excluded)
- **Example**: `PUT /updateadmin/507f1f77bcf86cd799439011`

### 5. DELETE `/deleteadmin/:id`
- **Description**: Delete admin
- **Parameters**: `id` (MongoDB ObjectId)
- **Response**: Success message with deleted admin info
- **Example**: `DELETE /deleteadmin/507f1f77bcf86cd799439011`

## Security Features:

1. **Password Hashing**: Passwords are hashed using bcryptjs before saving
2. **Password Exclusion**: Passwords and OTPs are never returned in responses
3. **Email Validation**: Checks for duplicate emails before creating/updating
4. **Input Validation**: Validates required fields
5. **Error Handling**: Comprehensive error handling with meaningful messages

## Notes:

- All passwords are automatically hashed before saving
- Email is stored in lowercase for consistency
- Admin flag is automatically set to `true` when creating new admin
- Timestamp is automatically set when creating new admin
- Default profile picture is `/avatar.png` if not provided

