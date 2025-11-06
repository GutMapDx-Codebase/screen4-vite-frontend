# Dashboard API Update for Admins Count

## Required Update:

Your dashboard API endpoint (`/getdashboarddata`) needs to include `adminsCount` in the response.

### Current Response Structure:
```javascript
{
  totalTests: <number>,
  clientsCount: <number>,
  collectorsCount: <number>,
  monthlyData: [...],
  reasonData: [...],
  jobStats: {
    pending: <number>,
    accepted: <number>,
    completed: <number>
  }
}
```

### Updated Response Structure:
```javascript
{
  totalTests: <number>,
  clientsCount: <number>,
  collectorsCount: <number>,
  adminsCount: <number>,  // ✅ ADD THIS
  monthlyData: [...],
  reasonData: [...],
  jobStats: {
    pending: <number>,
    accepted: <number>,
    completed: <number>
  }
}
```

## Backend Implementation Example:

```javascript
// In your dashboard route handler
router.get('/getdashboarddata', async (req, res) => {
  try {
    // ... existing code ...
    
    // Count admins
    const adminsCount = await Admin.countDocuments();
    
    // ... existing code ...
    
    res.status(200).json({
      totalTests: totalTests,
      clientsCount: clientsCount,
      collectorsCount: collectorsCount,
      adminsCount: adminsCount,  // ✅ ADD THIS LINE
      monthlyData: monthlyData,
      reasonData: reasonData,
      jobStats: jobStats
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});
```

## Don't Forget:

Make sure to import the Admin model in your dashboard route file:
```javascript
const Admin = require('../models/Admin');
```

