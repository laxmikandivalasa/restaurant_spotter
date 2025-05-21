const { loadData } = require('../lib/data');

module.exports = async (req, res) => {
  const restaurantData = await loadData();
  const cuisine = req.query.cuisine?.toLowerCase();
  if (!cuisine) return res.status(400).json({ error: 'Cuisine is required' });

  const results = restaurantData.filter((r) => {
    if (!r.cuisines || !Array.isArray(r.cuisines)) {
      return false;
    }
    return r.cuisines.some(c => c.toLowerCase().includes(cuisine));
  });
  res.status(200).json(results);
};