const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');

// Dynamic report endpoint
router.get('/getDynamicReport', async (req, res) => {
  const { startDate, endDate, location, testType } = req.query;

  try {
    const query = {};

    // Add filters to the query
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (location) {
      query.location = location;
    }
    if (testType) {
      query.testType = testType;
    }

    const jobRequests = await JobRequest.find(query);

    res.status(200).json(jobRequests);
  } catch (error) {
    console.error('Error fetching dynamic report:', error);
    res.status(500).json({ error: 'Failed to fetch dynamic report data' });
  }
});

module.exports = router;