const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    title: String,
    description: String,
    startBid: Number,
    currentBid: Number,
    endDate: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Auction', auctionSchema);
