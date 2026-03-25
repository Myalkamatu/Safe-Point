const User = require('../models/User');

exports.getOfficers = async (req, res) => {
  try {
    const officers = await User.find({ role: { $in: ['officer', 'super'] } })
      .select('-password')
      .populate('assignedAgency', 'name')
      .sort({ createdAt: -1 });
    res.json({ officers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOfficer = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: 'Phone number already registered' });

    const validRole = ['officer', 'super'].includes(role) ? role : 'officer';
    const user = await User.create({ name, phone, email, password, role: validRole });

    res.status(201).json({
      officer: { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleDuty = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const officer = await User.findById(req.params.id).select('-password');
    if (!officer) return res.status(404).json({ message: 'Officer not found' });

    officer.onDuty = !officer.onDuty;
    if (lat && lng) {
      officer.location = { lat, lng };
    }
    await officer.save();

    res.json({ officer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignAgency = async (req, res) => {
  try {
    const { agencyId } = req.body;
    const officer = await User.findByIdAndUpdate(
      req.params.id,
      { assignedAgency: agencyId },
      { new: true }
    ).select('-password').populate('assignedAgency', 'name');

    if (!officer) return res.status(404).json({ message: 'Officer not found' });
    res.json({ officer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
