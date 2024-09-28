const userCtrl = require('../controller/userCtrl');
const auth = require('../middleware/auth');

const router = require('express').Router();

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/refresh_token', userCtrl.refreshtoken);
router.get('/logout', userCtrl.logout);
router.get('/getuser', auth, userCtrl.getUser);

module.exports = router;