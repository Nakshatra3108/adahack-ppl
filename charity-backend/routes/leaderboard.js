const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');

// Get top users by total donated
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('name totalDonated')
      .sort({ totalDonated: -1 })
      .limit(10);
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top charities by total donations received
router.get('/charities', async (req, res) => {
  try {
    const charities = await Donation.aggregate([
      {
        $group: {
          _id: '$charityName',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: '$_id',
          totalAmount: 1,
          donationCount: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(charities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;