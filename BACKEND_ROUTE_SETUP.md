# Backend Route Setup Instructions

## Issues Fixed:
1. ✅ Removed space from route path: `"/getcocforms/:jobId/:collectorId"` (was `"/getcocforms/:jobId /:collectorId"`)
2. ✅ Removed duplicate console.log
3. ✅ Added null/undefined collectorId handling
4. ✅ Added backward compatible route for `/getcocforms/:jobId`

## Backend Route Registration

Add this to your main server file (e.g., `server.js`, `index.js`, or `app.js`):

```javascript
const express = require('express');
const app = express();

// Import the COC routes
const cocRoutes = require('./routes/coc'); // Adjust path as needed

// Register the routes
app.use('/api', cocRoutes); // or use your API prefix like '/api/v1'

// Or if you want it at root level:
// app.use('/', cocRoutes);
```

## Model Import Path

Make sure the `Screen4test` model path is correct in `src/backend/routes/coc.js`:

```javascript
const Screen4test = require('../models/Screen4test'); // Adjust this path
```

If your model is in a different location, update line 4 in `src/backend/routes/coc.js`.

## Available Endpoints:

1. **GET `/getcocforms/:jobId/:collectorId`** - Get COC forms by job ID and collector ID
2. **GET `/getcocforms/:jobId`** - Get all COC forms for a job (backward compatible)

## Frontend Changes:

✅ Updated `src/pages/clientDetails.jsx` to conditionally build URL:
- If `collectorId` exists → `/getcocforms/${id}/${collectorId}`
- If `collectorId` is null/undefined → `/getcocforms/${id}`

