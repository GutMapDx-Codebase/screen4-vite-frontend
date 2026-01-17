# Backend Pagination API Requirements

## Frontend se Expected Response Format

Frontend pagination ke liye yeh format expect karta hai:

### 1. `/getjobrequests` Endpoint (Admin & Client)

**Request:**
```
GET /getjobrequests?id={clientId}&status={status}&page={pageNumber}&limit={limit}&token={token}&search={query}
```

**Expected Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "jobReferenceNo": "S4/80185",
      "customer": "...",
      "location": "...",
      "dateAndTimeOfCollection": "...",
      // ... other job fields
    }
  ],
  "total": 25,           // ✅ REQUIRED: Total number of items across all pages
  "totalPages": 3,       // ✅ REQUIRED: Total number of pages
  "currentPage": 1       // ✅ REQUIRED: Current page number
}
```

**Important Points:**
- `success` field **MUST** be `true` (frontend checks this)
- `total` = Total count of all matching records (not just current page)
- `totalPages` = `Math.ceil(total / limit)`
- `currentPage` = Current page number (1-based)
- `data` = Array of job records for current page only

---

### 2. `/getjobsbycollector/{collectorId}` Endpoint (Collector)

**Request:**
```
GET /getjobsbycollector/{collectorId}?status={status}&token={token}&page={pageNumber}&limit={limit}&search={query}
```

**Expected Response Format (Option 1 - Recommended):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "jobReferenceNo": "S4/80185",
      // ... job fields
    }
  ],
  "total": 15,
  "totalPages": 2,
  "currentPage": 1
}
```

**Expected Response Format (Option 2 - Fallback):**
```json
{
  "data": [
    // ... job records
  ],
  "total": 15,
  "totalPages": 2,
  "currentPage": 1
}
```

**Expected Response Format (Option 3 - Minimal):**
```json
{
  "data": [
    // ... job records
  ],
  "count": 15
}
```

---

## Backend Implementation Example

### Example for `/getjobrequests`:

```javascript
router.get('/getjobrequests', async (req, res) => {
  try {
    const { id, status, page = 1, limit = 10, token, search = '' } = req.query;
    
    // Validate token
    if (token !== 'expected_token') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // Build query
    let query = {};
    if (id) query.clientId = id;
    if (status) query.status = status.toLowerCase();
    
    // Search functionality
    if (search) {
      query.$or = [
        { customer: { $regex: search, $options: 'i' } },
        { jobReferenceNo: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    
    // Get total count (BEFORE pagination)
    const total = await JobRequest.countDocuments(query);
    
    // Get paginated data
    const data = await JobRequest.find(query)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 }); // or your preferred sort
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limitNumber);
    
    // ✅ Return proper response
    res.json({
      success: true,
      data: data,
      total: total,              // ✅ Total count
      totalPages: totalPages,    // ✅ Total pages
      currentPage: pageNumber    // ✅ Current page
    });
    
  } catch (error) {
    console.error('Error fetching job requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job requests',
      error: error.message
    });
  }
});
```

### Example for `/getjobsbycollector/{collectorId}`:

```javascript
router.get('/getjobsbycollector/:collectorId', async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { status, token, page = 1, limit = 10, search = '' } = req.query;
    
    // Validate token
    if (token !== 'collectorgfdgdfg548745gdfgdfg789dfg') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // Build query
    let query = { collectors: { $elemMatch: { collectorsId: collectorId } } };
    if (status) {
      query['collectors.status'] = status.toLowerCase() === 'accepted';
      // Adjust based on your schema
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { customer: { $regex: search, $options: 'i' } },
        { jobReferenceNo: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    
    // Get total count
    const total = await JobRequest.countDocuments(query);
    
    // Get paginated data
    const data = await JobRequest.find(query)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limitNumber);
    
    // ✅ Return proper response
    res.json({
      success: true,
      data: data,
      total: total,
      totalPages: totalPages,
      currentPage: pageNumber
    });
    
  } catch (error) {
    console.error('Error fetching collector jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collector jobs',
      error: error.message
    });
  }
});
```

---

## Common Issues & Fixes

### ❌ Issue 1: Missing `total` field
**Problem:** Backend se `total` nahi aa raha
**Fix:** Always return `total` with count of ALL matching records

### ❌ Issue 2: Missing `totalPages` field
**Problem:** Backend se `totalPages` nahi aa raha
**Fix:** Calculate: `Math.ceil(total / limit)`

### ❌ Issue 3: Missing `currentPage` field
**Problem:** Backend se `currentPage` nahi aa raha
**Fix:** Return the `page` parameter value

### ❌ Issue 4: `success` field missing or false
**Problem:** Frontend checks `if (!data.success)` and throws error
**Fix:** Always return `success: true` for successful requests

### ❌ Issue 5: Returning all data instead of paginated
**Problem:** Backend se saare records aa rahe hain, pagination nahi ho rahi
**Fix:** Use `.skip()` and `.limit()` in MongoDB query

---

## Testing Checklist

- [ ] Response mein `success: true` hai
- [ ] Response mein `total` field hai (total count)
- [ ] Response mein `totalPages` field hai
- [ ] Response mein `currentPage` field hai
- [ ] `data` array mein sirf current page ke items hain
- [ ] `total` = actual total count (not just current page length)
- [ ] `totalPages` = `Math.ceil(total / limit)`
- [ ] Search query properly filter kar raha hai
- [ ] Status filter properly kaam kar raha hai
- [ ] Page number change par different data aa raha hai

---

## Frontend Debugging

Frontend console mein yeh logs dikhenge:
- `📊 Admin/Client API Response` - Backend response check karein
- `✅ Data fetched successfully` - Final state check karein
- `📄 Pagination Render Check` - Pagination render status

Agar backend se proper data nahi aa raha, to frontend fallback logic use karega, lekin ideal case mein backend se proper data aana chahiye.
