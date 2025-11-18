const fs = require('fs').promises;
const path = require('path');

let restaurantData = [];

async function loadData() {
  if (restaurantData.length) return restaurantData;
  try {
    const filePath = path.join(process.cwd(), 'data', 'restaurants.json');
    console.log('Loading file from:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    restaurantData = JSON.parse(data);
    console.log(`Loaded ${restaurantData.length} restaurants`);
  } catch (error) {
    console.error('Error loading restaurant data:', error);
    restaurantData = [];
  }
  return restaurantData;
}

module.exports = { loadData };