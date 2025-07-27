import express from 'express';
const router =express.Router();
import { checkAuth, deleteAccount, login, logout, signup, updateProfile } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth);




router.delete("/delete", protectRoute, deleteAccount);


export default router;