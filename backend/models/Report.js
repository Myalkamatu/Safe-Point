const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crimeType: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: '' }
  },
  agencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }],
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['pending', 'reviewing', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
