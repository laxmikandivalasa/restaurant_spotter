console.log("🔍 search.js loaded");

const express = require('express');
const router = express.Router();
const { loadData } = require('../lib/data');

router.get('/', async (req, res) => {
  const restaurantData = await loadData();
  const query = req.query.name?.toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "name" is required' });
  }

  const results = restaurantData.filter((r) =>
    r.Name && r.Name.toLowerCase().includes(query)
  );

  res.status(200).json(results);
});

module.exports = router;
