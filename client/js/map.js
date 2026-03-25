// ===== Leaflet Map Helpers =====

const MapHelper = {
  create: (elementId, lat = 9.0579, lng = 7.4951, zoom = 13) => {
    const map = L.map(elementId).setView([lat, lng], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    return map;
  },

  addMarker: (map, lat, lng, popupText, color = 'red') => {
    const iconHtml = `<div style="background:${color === 'red' ? '#BC0100' : color === 'blue' ? '#2563EB' : '#16a34a'};width:12px;height:12px;border:2px solid #fff;border-radius:50%;"></div>`;
    const icon = L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    const marker = L.marker([lat, lng], { icon }).addTo(map);
    if (popupText) marker.bindPopup(popupText);
    return marker;
  },

  addDraggableMarker: (map, lat, lng, onDrag) => {
    const icon = L.divIcon({
      html: '<div style="background:#BC0100;width:16px;height:16px;border:3px solid #fff;border-radius:50%;"></div>',
      className: '',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      if (onDrag) onDrag(pos.lat, pos.lng);
    });
    return marker;
  },

  fitMarkers: (map, markers) => {
    if (markers.length === 0) return;
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
};
