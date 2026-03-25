// Haversine formula - distance between two coordinates in km
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findNearest = (items, lat, lng, limit = 3) => {
  return items
    .map((item) => ({
      ...item.toObject ? item.toObject() : item,
      distance: getDistance(lat, lng, item.location.lat, item.location.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};

module.exports = { getDistance, findNearest };
