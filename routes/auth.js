const path = require('path');

const express = require('express');

const router = express.Router();

const authRouter = require('../controllers/auth');

router.get('/login',authRouter.getLogin);

router.get('/signup',authRouter.getSignUp);

router.post('/login',authRouter.postLogin);

router.post('/signup',authRouter.postSignUp);

router.post('/logout',authRouter.postLogout);

router.get('/reset',authRouter.getReset);

module.exports = router;