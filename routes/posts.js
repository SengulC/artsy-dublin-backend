// this is the router for posts related stuff

const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const {authenticate} = require("../middleware/auth");

// get routes
router.get('/', postsController.getAllPosts);
router.get('/event/:eventId', postsController.getPostsByEvent);
router.get('/user/:userId', postsController.getPostsByUser);
router.get('/:postId', postsController.getPostById);

// images now handled inside postsController via processUploadedImages
router.post('/post/:eventAttendedId', authenticate, postsController.createPost);
router.post('/comment/:parentPostId', authenticate, postsController.createComment);

// interactions
router.post('/:postId/like', authenticate, postsController.likeToggle);
router.patch('/:postId', authenticate, postsController.editPost);
router.delete('/:postId', authenticate, postsController.deletePost);

// attendance
router.get("/:eventId/attend", authenticate, postsController.getAttendanceStatus);
router.post("/:eventId/attend", authenticate, postsController.logEvent);
router.delete("/:eventAttendId/attend", authenticate, postsController.deleteAttendance);
router.patch("/:eventAttendId/rating", authenticate, postsController.updateRating);

module.exports = router;