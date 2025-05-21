const { loadData } = require('../lib/data');

module.exports = async (req, res) => {
  const restaurantData = await loadData();
  const name = req.query.name?.toLowerCase();
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const results = restaurantData.filter((r) =>
    r.Name?.toLowerCase().includes(name)
  );
  res.status(200).json(results);
};