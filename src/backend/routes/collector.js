const express = require('express');
const router = express.Router();
const Collector = require('../models/Collector');

// Endpoint to fetch collectors
router.get('/getCollectors', async (req, res) => {
  try {
    const collectors = await Collector.find();
    res.status(200).json(collectors);
  } catch (error) {
    console.error('Error fetching collectors:', error);
    res.status(500).json({ error: 'Failed to fetch collectors' });
  }
});

module.exports = router;