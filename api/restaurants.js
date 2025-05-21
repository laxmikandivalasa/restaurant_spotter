const { loadData } = require('../lib/data');

module.exports = async (req, res) => {
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

  res.status(200).json({
    restaurants: paginatedRestaurants,
    totalPages,
    currentPage: page
  });
};