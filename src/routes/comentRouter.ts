import express from 'express';

import commentController from '../controllers/commentController';
import authentication from '../middlewares/authentication';

const router = express.Router();

router.post('/comment', authentication, commentController.createComment);

router.patch('/comment/:id', authentication, commentController.updateComment);

router.patch('/comment/:id/like', authentication, commentController.likeComment);

router.patch('/comment/:id/unlike', authentication, commentController.unLikeComment);

router.delete('/comment/:id', authentication, commentController.deleteComment);

export default router;
