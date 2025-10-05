const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's donations
router.get('/user', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create donation
router.post('/', auth, async (req, res) => {
  try {
    const { charityName, charityGroup, amount } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const donation = new Donation({
      userId: req.userId,
      userName: user.name,
      charityName,
      charityGroup,
      amount,
    });

    await donation.save();

    await User.findByIdAndUpdate(req.userId, {
      $inc: { totalDonated: amount },
    });

    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Donation failed' });
  }
});

module.exports = router;