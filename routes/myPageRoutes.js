const express = require('express');
const myPageController = require('../controllers/myPageController');
//const authenticate = require('../middleware/authenticate');
const IsAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

/**
 * @swagger
 * /api/mypage/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - MyPage
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user profile.
 *       401:
 *         description: Unauthorized.
 */
router.get('/profile', IsAuthenticated, myPageController.getUserProfile);

/**
 * @swagger
 * /api/mypage/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - MyPage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               # Define the properties of the user profile here
 *               # For example:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *       401:
 *         description: Unauthorized.
 */
router.put('/profile', IsAuthenticated, myPageController.updateUserProfile);

/**
 * @swagger
 * /api/mypage/profile:
 *   delete:
 *     summary: Delete user profile
 *     tags:
 *       - MyPage
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile deleted successfully.
 *       401:
 *         description: Unauthorized.
 */
router.delete('/profile', IsAuthenticated, myPageController.deleteUser);

module.exports = router;
