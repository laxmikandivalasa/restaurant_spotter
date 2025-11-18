console.log("🔍 restaurants.js loaded");
const express = require('express');
const router = express.Router();
const { loadData } = require('../lib/data');

router.get('/', async (req, res) => {
  try {
    const restaurantData = await loadData();
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    if (!restaurantData.length) {
      return res.status(500).json({ error: 'No restaurant data available' });
    }

    const paginatedRestaurants = restaurantData.slice(start, end);
    const totalPages = Math.ceil(restaurantData.length / perPage);

    // Debugging logs moved inside the route handler
    console.log('📥 Received request at /api/restaurants');
    console.log('Query parameters:', req.query);
    console.log('Total restaurants loaded:', restaurantData.length);
    console.log('Paginated data:', paginatedRestaurants);

    res.status(200).json({
      restaurants: paginatedRestaurants,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error in /api/restaurants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Remove logs outside the route handler
module.exports = router;