const express = require('express');
const router = express.Router();
// Note: Adjust the model import path based on your backend structure
const Screen4test = require('../models/Screen4test'); // Adjust path as needed

// Get COC forms by job ID and collector ID
router.get("/getcocforms/:jobId/:collectorId", async (req, res) => {
  try {
    const { jobId, collectorId } = req.params;

    console.log("Fetching COC forms for job:", jobId, "collector:", collectorId);

    // Build query - collectorId might be 'null' or 'undefined' as string
    const query = {
      jobRequestId: jobId
    };

    // Only add collectorId to query if it's not null/undefined
    if (collectorId && collectorId !== 'null' && collectorId !== 'undefined') {
      query.collectorId = collectorId;
    }

    const forms = await Screen4test.find(query).lean();

    console.log(`Found ${forms.length} COC forms for job:`, jobId);

    return res.status(200).json({
      message: "COC forms fetched successfully",
      data: forms,
      count: forms.length
    });

  } catch (error) {
    console.error("Error fetching COC forms:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// Alternative route for getting all COC forms by job ID only (for backward compatibility)
router.get("/getcocforms/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    console.log("Fetching all COC forms for job:", jobId);

    const forms = await Screen4test.find({
      jobRequestId: jobId
    }).lean();

    console.log(`Found ${forms.length} COC forms for job:`, jobId);

    return res.status(200).json({
      message: "COC forms fetched successfully",
      data: forms,
      count: forms.length
    });

  } catch (error) {
    console.error("Error fetching COC forms:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

module.exports = router;

