require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../backend/models/User');
const Agency = require('../backend/models/Agency');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Agency.deleteMany({});

    // Create super officer
    await User.create({
      name: 'Super Admin',
      phone: '0000000000',
      email: 'admin@safepoint.com',
      password: 'admin123',
      role: 'super',
      onDuty: true,
      location: { lat: 9.0579, lng: 7.4951 }
    });

    // Create patrol officers
    await User.create([
      {
        name: 'Officer Alpha',
        phone: '1111111111',
        password: 'officer123',
        role: 'officer',
        onDuty: true,
        location: { lat: 9.0600, lng: 7.5000 }
      },
      {
        name: 'Officer Bravo',
        phone: '2222222222',
        password: 'officer123',
        role: 'officer',
        onDuty: false,
        location: { lat: 9.0550, lng: 7.4900 }
      }
    ]);

    // Create agencies
    await Agency.create([
      {
        name: 'Central Police Station',
        phone: '08012345678',
        type: 'police',
        location: { lat: 9.0579, lng: 7.4951 }
      },
      {
        name: 'East Division Security',
        phone: '08098765432',
        type: 'police',
        location: { lat: 9.0650, lng: 7.5100 }
      },
      {
        name: 'West Guard Post',
        phone: '08055566677',
        type: 'security',
        location: { lat: 9.0500, lng: 7.4800 }
      }
    ]);

    console.log('Seed data created successfully');
    console.log('Super Officer -> phone: 0000000000, password: admin123');
    console.log('Officer Alpha -> phone: 1111111111, password: officer123');
    console.log('Officer Bravo -> phone: 2222222222, password: officer123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
