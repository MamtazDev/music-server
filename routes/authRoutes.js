const express = require("express");
const router = express.Router();

// Import the controller functions and middleware
const authController = require("../controllers/authController");
//const authenticate = require("../middleware/authenticate");
const IsAuthenticated = require("../middleware/isAuthenticated");
const { updateUser } = require("../controllers/userController");

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Test endpoint without authentication
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Test endpoint response.
 */

/**
 * @swagger
 * /api/auth/test-auth:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Test endpoint with authentication
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Test endpoint with authentication response.
 */

// Existing routes
/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get user data
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns user data.
 */
router.get(
  "/user",
  (req, res, next) => {
    console.log("[DEBUG] Testing middleware in /api/auth/user");
    next();
  },
  IsAuthenticated,
  (req, res) => {
    console.log("[DEBUG] [GET /api/auth/user] - Sending response");
    authController.getUser(req, res);
  }
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully.
 */
router.post("/register", (req, res) => {
  console.log("[DEBUG] [POST /api/auth/register] - Request body:", req.body);
  authController.register(req, res);
  console.log("[DEBUG] [POST /api/auth/register] - Response sent");
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 */
router.post("/login", (req, res) => {
  console.log("[DEBUG] [POST /api/auth/login] - Request body:", req.body);
  authController.login(req, res);
  console.log("[DEBUG] [POST /api/auth/login] - Response sent");
});
router.patch("/update-profile/:id", (req, res) => {
  console.log("[DEBUG] [POST /api/auth/login] - Request body:", req.body);
  authController.updateUser(req, res);
  console.log("[DEBUG] [POST /api/auth/login] - Response sent");
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh user tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully.
 */
router.post("/refresh", (req, res) => {
  console.log("[DEBUG] [POST /api/auth/refresh] - Request body:", req.body);
  authController.refresh(req, res);
  console.log("[DEBUG] [POST /api/auth/refresh] - Response sent");
});

module.exports = router;
