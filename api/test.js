const { loadData } = require('../lib/data');

module.exports = async (req, res) => {
  try {
    const restaurantData = await loadData();
    res.status(200).json({ message: 'File found', length: restaurantData.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};