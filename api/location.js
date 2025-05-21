const { loadData } = require('../lib/data');

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = async (req, res) => {
  const restaurantData = await loadData();
  const { lat, lng, maxDistance = 10 } = req.query;
  if (!lat || !lng)
    return res.status(400).json({ error: 'Latitude and longitude are required' });

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  const results = restaurantData
    .filter((r) => typeof r.latitude === 'number' && typeof r.longitude === 'number')
    .map((restaurant) => {
      const distance = getDistance(
        userLat,
        userLng,
        restaurant.latitude,
        restaurant.longitude
      );
      return { ...restaurant, distance };
    })
    .filter((restaurant) => restaurant.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  res.status(200).json(results);
};