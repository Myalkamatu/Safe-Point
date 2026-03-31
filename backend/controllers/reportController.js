const Report = require('../models/Report');
const Agency = require('../models/Agency');
const User = require('../models/User');
const { findNearest } = require('../utils/helpers');
const { getIO } = require('../utils/socket');
const webpush = require('web-push');

exports.createReport = async (req, res) => {
  try {
    const { crimeType, description, lat, lng, address, dispatchTypes } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const allAgencies = await Agency.find();
    const targetAgencies = [];
    let parsedTypes = [];
    try {
      parsedTypes = typeof dispatchTypes === 'string' ? JSON.parse(dispatchTypes) : (dispatchTypes || []);
    } catch(e) { parsedTypes = []; }

    for (const type of parsedTypes) {
      const validAgencies = allAgencies.filter(a => a.type === type);
      if (validAgencies.length > 0) {
        const nearest = findNearest(validAgencies, parseFloat(lat), parseFloat(lng), 1);
        if (nearest.length > 0) targetAgencies.push(nearest[0]._id);
      }
    }

    const report = await Report.create({
      citizen: req.user._id,
      crimeType,
      description,
      image,
      location: { lat: parseFloat(lat), lng: parseFloat(lng), address },
      agencies: targetAgencies
    });

    // Find nearest agencies (for emit fallback)
    const nearestAgencies = findNearest(allAgencies, parseFloat(lat), parseFloat(lng), 3);

    // Find nearest on-duty officers
    const officers = await User.find({
      role: { $in: ['officer', 'super'] },
      onDuty: true,
      'location.lat': { $ne: 0 }
    });
    const nearestOfficers = findNearest(officers, parseFloat(lat), parseFloat(lng), 5);

    // Assign to nearest officer if available
    if (nearestOfficers.length > 0) {
      report.assignedOfficer = nearestOfficers[0]._id;
      await report.save();
    }

    // Populate the report for emitting
    const populated = await Report.findById(report._id)
      .populate('citizen', 'name phone')
      .populate('agencies', 'name type')
      .populate('assignedOfficer', 'name phone');

    // Emit to all officers and super officers
    const io = getIO();
    io.to('role_officer').to('role_super').emit('new-report', {
      report: populated,
      nearestAgencies
    });

    // Send push notifications to nearest officers
    for (const officer of nearestOfficers) {
      if (officer.pushSubscription) {
        try {
          await webpush.sendNotification(
            officer.pushSubscription,
            JSON.stringify({
              title: 'New Crime Report',
              body: `${crimeType} reported near your area`,
              data: { reportId: report._id }
            })
          );
        } catch (pushErr) {
          console.log('Push notification failed for officer:', officer._id);
        }
      }
    }

    res.status(201).json({ report: populated, nearestAgencies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'citizen') {
      query.citizen = req.user._id;
    } else if (req.user.role === 'officer') {
      query.$or = [
        { assignedOfficer: req.user._id },
        { agencies: req.user.assignedAgency }
      ];
    }
    // super sees all reports

    const reports = await Report.find(query)
      .populate('citizen', 'name phone')
      .populate('agencies', 'name type')
      .populate('assignedOfficer', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('citizen', 'name phone')
      .populate('agencies', 'name type location')
      .populate('assignedOfficer', 'name phone');

    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('citizen', 'name phone')
      .populate('agencies', 'name type')
      .populate('assignedOfficer', 'name phone');

    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Notify citizen of status change
    const io = getIO();
    io.to(`user_${report.citizen._id}`).emit('report-updated', { report });

    res.json({ report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
