import express from 'express';

import postController from '../controllers/postController';
import authentication from '../middlewares/authentication';

const router = express.Router();

router.get('/post', authentication, postController.getPosts);
router.get('/post/:id', authentication, postController.getPost);
router.get('/post-user/:id', authentication, postController.getUserPosts);

router.post('/post', authentication, postController.createPost);

router.delete('/post/:id', authentication, postController.deletePost);

router.patch('/post/:id', authentication, postController.updatePost);
router.patch('/post/:id/like', authentication, postController.likePost);
router.patch('/post/:id/unlike', authentication, postController.unLikePost);

export default router;
