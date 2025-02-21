import express from 'express';
import {register, login, changePassword, verifyEmail, logout} from '../controller/user.controller.js'
import isAuthenticatedd from '../midddlewares/isAuthenticated.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout)
router.route('/verify-email/:token').get(verifyEmail)
router.route('/changepassword').put(isAuthenticatedd, changePassword)

export default router;