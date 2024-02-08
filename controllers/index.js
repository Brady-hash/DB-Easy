const router = require('express').Router();

const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api');
const adminRoutes = require('./adminRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
