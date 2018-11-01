const router = require('express').Router();

router.use('/auth', require('./auth'))
router.use('/users', require('./user'))
router.use('/boards', require('./board'))
router.use('/lists', require('./list'))
// router.use('/cards', require('./card'))

module.exports = router;