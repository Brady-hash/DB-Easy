const router = require('express').Router();

const userRoutes = require('./userRoutes');
const dogRoutes = require('./dogRoutes');
const eventRoutes = require('./eventRoutes');

router.use('/user', userRoutes);
router.use('/', dogRoutes);
router.use('/', eventRoutes);

module.exports = router;
