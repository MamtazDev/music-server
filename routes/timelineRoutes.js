const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const IsAuthenticated = require("../middleware/IsAuthenticated");
const timelineController = require("../controllers/timelineController");

/**
 * @swagger
 * /api/timeline:
 *   get:
 *     summary: Get timeline
 *     tags:
 *       - Timeline
 *     responses:
 *       200:
 *         description: Returns the timeline.
 */
router.get(
  "/",
  (req, res, next) => {
    console.log("Accessed the timeline route");
    next();
  },
  timelineController.getTimeline
);

/**
 * @swagger
 * /api/timeline/test:
 *   get:
 *     summary: Test endpoint
 *     tags:
 *       - Timeline
 *     responses:
 *       200:
 *         description: Test endpoint response.
 */
router.get("/test", (req, res) => {
  console.log("Test endpoint hit");
  res.send("Test endpoint");
});

/**
 * @swagger
 * /api/timeline/items:
 *   post:
 *     summary: Add timeline item
 *     tags:
 *       - Timeline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *               bandNames:
 *                 type: string
 *               songNames:
 *                 type: string
 *               searchField:
 *                 type: string
 *               spotifyLinks:
 *                 type: array
 *                 items:
 *                   type: string
 *               youtubeLinks:
 *                 type: array
 *                 items:
 *                   type: string
 *               myStory:
 *                 type: string
 *     responses:
 *       200:
 *         description: Timeline item added successfully.
 *       400:
 *         description: Bad request.
 */
router.post(
  "/items",
  IsAuthenticated, // Changed from protect
  [
    body("year", "Year is required").not().isEmpty(),
    body("bandNames", "Band is required").not().isEmpty(),
    body("songNames", "Song is required").not().isEmpty(),
    body("searchField", "OpenAI field is required").optional(),
    body("spotifyLinks.*").optional().isURL(),
    body("youtubeLinks.*").optional().isURL(),
    body("myStory", "My Story field is required").not().isEmpty(),
  ],
  timelineController.addTimelineItem
);

/**
 * @swagger
 * /api/timeline/items/{id}:
 *   put:
 *     summary: Update timeline item
 *     tags:
 *       - Timeline
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the timeline item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: string
 *               bandNames:
 *                 type: string
 *               songNames:
 *                 type: string
 *               searchField:
 *                 type: string
 *               spotifyLinks:
 *                 type: array
 *                 items:
 *                   type: string
 *               youtubeLinks:
 *                 type: array
 *                 items:
 *                   type: string
 *               myStory:
 *                 type: string
 *     responses:
 *       200:
 *         description: Timeline item updated successfully.
 *       400:
 *         description: Bad request.
 */
router.put(
  "/items/:id",
  IsAuthenticated, // Changed from protect
  [
    body("year", "Year is required").optional().not().isEmpty(),
    body("bandNames", "Band is required").optional().not().isEmpty(),
    body("songNames", "Song is required").optional().not().isEmpty(),
    body("searchField", "OpenAI field is required").optional(),
    body("spotifyLinks.*").optional().isURL(),
    body("youtubeLinks.*").optional().isURL(),
    body("myStory", "My Story field is required").optional().not().isEmpty(),
    body("videoUrl", "Video URL is required").optional().not().isEmpty(),
  ],
  timelineController.updateTimelineItem
);

/**
 * @swagger
 * /api/timeline/{id}:
 *   delete:
 *     summary: Delete timeline item
 *     tags:
 *       - Timeline
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the timeline item to delete
 *     responses:
 *       200:
 *         description: Timeline item deleted successfully.
 *       400:
 *         description: Bad request.
 */
router.delete("/:id", IsAuthenticated, timelineController.deleteTimelineItem); // Changed from protect
router.patch("/:id", IsAuthenticated, timelineController.updateTimeLine); // Changed from protect

module.exports = router;
