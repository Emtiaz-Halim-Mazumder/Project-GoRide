const mongoose = require('mongoose');

// MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017/GoRide';

// Import models (using require since this is a standalone script)
// We need to simulate the mongoose models
const userSchema = new mongoose.Schema({
    name: String,
    trustScore: { type: Number, default: 5.0 },
    totalRatings: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const rideSchema = new mongoose.Schema({
    riderRating: Number,
    driverRating: Number,
    creator: mongoose.Schema.Types.ObjectId,
    passengers: [mongoose.Schema.Types.ObjectId],
    status: String
});
const Ride = mongoose.models.Ride || mongoose.model('Ride', rideSchema);

const emergencyContactSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    name: String
});
const EmergencyContact = mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);

const reviewLogSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    action: String,
    rating: Number
});
const ReviewLog = mongoose.models.ReviewLog || mongoose.model('ReviewLog', reviewLogSchema);

async function runTest() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Setup users
    const driver = await User.create({ name: 'Test Driver', trustScore: 5.0 });
    const rider = await User.create({ name: 'Test Rider', trustScore: 5.0 });

    console.log('Users created:', { driverId: driver._id, riderId: rider._id });

    // 2. Setup Emergency Contacts
    await EmergencyContact.create({ userId: driver._id, name: 'Contact' });
    await EmergencyContact.create({ userId: rider._id, name: 'Contact' });
    console.log('Emergency contacts created');

    // 3. Setup Rides
    const ride1 = await Ride.create({ creator: driver._id, passengers: [rider._id], status: 'completed' });
    const ride2 = await Ride.create({ creator: driver._id, passengers: [rider._id], status: 'completed' });
    const ride3 = await Ride.create({ creator: driver._id, passengers: [rider._id], status: 'completed' });

    console.log('Rides created');

    // 4. Test Normal Rating
    // Simulate updating trust score (Logic from API)
    async function updateTrustScore(targetUserId, rating) {
        const targetUser = await User.findById(targetUserId);
        const totalRatings = (targetUser.totalRatings || 0) + 1;
        const currentScore = targetUser.trustScore || 5.0;
        const newScore = ((currentScore * (totalRatings - 1)) + rating) / totalRatings;
        targetUser.trustScore = Math.round(newScore * 10) / 10;
        targetUser.totalRatings = totalRatings;
        await targetUser.save();
        return targetUser;
    }

    console.log('Rating ride 1 with 4 stars...');
    await updateTrustScore(driver._id, 4);
    let updatedDriver = await User.findById(driver._id);
    console.log('Driver Trust Score:', updatedDriver.trustScore); // Should be 4.5 if initial was 5.0 and totalRatings was 1? 
    // Wait, initial trustScore 5.0, totalRatings 0.
    // totalRatings = 1, currentScore = 5.0. 
    // newScore = ((5.0 * 0) + 4) / 1 = 4. Correct.

    // 5. Test Fraud Detection (Simulation)
    async function checkFraud(userId, rating) {
        const previousRidesRider = await Ride.find({ passengers: userId, riderRating: { $exists: true } }).sort({ updatedAt: -1 }).limit(2);
        const previousRidesDriver = await Ride.find({ creator: userId, driverRating: { $exists: true } }).sort({ updatedAt: -1 }).limit(2);
        const allPreviousRatings = [...previousRidesRider.map(r => r.riderRating), ...previousRidesDriver.map(r => r.driverRating)].slice(0, 2);

        if (allPreviousRatings.length === 2 && allPreviousRatings.every(r => r === rating)) {
            await User.findByIdAndUpdate(userId, { trustScore: 0, isFlagged: true });
            await ReviewLog.create({ userId, action: 'FRAUD_DETECTED', rating });
            return true;
        }
        return false;
    }

    // Set previous ratings
    ride1.driverRating = 5;
    await ride1.save();
    ride2.driverRating = 5;
    await ride2.save();

    console.log('Testing fraud with 3rd consecutive 5-star rating...');
    const isFraud = await checkFraud(rider._id, 5);
    console.log('Fraud detected:', isFraud);

    const flaggedRider = await User.findById(rider._id);
    console.log('Rider status:', { trustScore: flaggedRider.trustScore, isFlagged: flaggedRider.isFlagged });

    // Cleanup
    await User.deleteMany({ _id: { $in: [driver._id, rider._id] } });
    await Ride.deleteMany({ _id: { $in: [ride1._id, ride2._id, ride3._id] } });
    await EmergencyContact.deleteMany({ userId: { $in: [driver._id, rider._id] } });
    await ReviewLog.deleteMany({ userId: rider._id });

    console.log('Test completed and cleaned up');
    process.exit(0);
}

runTest().catch(err => {
    console.error(err);
    process.exit(1);
});
