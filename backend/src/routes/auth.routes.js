const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');

router.post('/login', auth.login);
router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);
router.get('/me', authenticate, auth.me);
router.post('/change-password', authenticate, auth.changePassword);

module.exports = router;