import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  signin,
  signout,
  signup,
  updateName,
  updatePassword,
  verifyUser,
  delAccount,
} from '../controller/user.js';

import * as controller from '../controller/yt.js';

const router = express.Router();

// User routes
router.post('/auth/user/signin', asyncHandler(signin));
router.post('/auth/user/signup', asyncHandler(signup));
router.post('/user/signout', signout);
router.delete('/user/delaccount/:userId', asyncHandler(delAccount));
router.patch('/user/update-name/:userId', asyncHandler(updateName));
router.patch('/user/update-password/:userId', asyncHandler(updatePassword));
router.get('/auth/user/verify/:userId/:verificationToken', asyncHandler(verifyUser));
router.get('/verify/:userId/:token', asyncHandler(verifyUser));
router.get('/user-api/auth/user/verify/:userId/:verificationToken', asyncHandler(verifyUser));

// Youtube routes
router.get('/notes', asyncHandler(controller.getEverything));
router.get('/notes/getApi', asyncHandler(controller.getApi));
router.post('/notes/videolink', asyncHandler(controller.insertVideo));
router.get('/notes/videonotes/:id', asyncHandler(controller.getVideoNote));
router.post('/notes/videoNote', asyncHandler(controller.postVideoNotiz));
router.patch('/notes/changeNote', asyncHandler(controller.patchYouTubeNoteWithUpdates));
router.delete(
  '/notes/deleteNote/:youtubeNoteId',
  asyncHandler(controller.deleteYouTubeNoteAndAssociatedNoteController),
);

export default router;
