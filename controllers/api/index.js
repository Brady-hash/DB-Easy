const router = require('express').Router();

const userRoutes = require('./userRoutes');
const dogRoutes = require('./dogRoutes');
const eventRoutes = require('./eventRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/user', userRoutes);
router.use('/dog', dogRoutes);
router.use('/event', eventRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
