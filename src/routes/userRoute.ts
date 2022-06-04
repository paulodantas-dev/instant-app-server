import express from 'express';

import userController from '../controllers/userController';
import authentication from '../middlewares/authentication';

const router = express.Router();

router.get('/user/search', authentication, userController.searchUser);
router.get('/user/:id', authentication, userController.getUser);

router.patch('/user', authentication, userController.updateUser);
router.patch('/user/:id/follow', authentication, userController.follow);
router.patch('/user/:id/unfollow', authentication, userController.unfollow);

export default router;
