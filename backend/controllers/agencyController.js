const Agency = require('../models/Agency');

exports.getAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().sort({ name: 1 });
    res.json({ agencies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAgency = async (req, res) => {
  try {
    const { name, phone, type, lat, lng } = req.body;
    const agency = await Agency.create({
      name, phone, type,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) }
    });
    res.status(201).json({ agency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
