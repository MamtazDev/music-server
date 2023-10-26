const { validationResult } = require("express-validator");
const TimelineItem = require("../models").TimelineItem;

exports.getTimeline = async (req, res) => {
  console.log("Entering getTimeline function");
  try {
    const timelineItems = await TimelineItem.find();
    console.log(
      "Successfully fetched timeline items. Exiting getTimeline function."
    );
    res.json(timelineItems);
  } catch (err) {
    console.error(
      "Error in getTimeline. Exiting getTimeline function:",
      err.message
    );
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.addTimelineItem = async (req, res) => {
  console.log("Entering addTimelineItem function");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors found. Exiting addTimelineItem function.");
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const newItemData = {
      ...req.body,
      userId: req.user.id,
    };

    // Check if videoUrl is provided and convert it to a full YouTube URL
    if (req.body.videoUrl) {
      const fullYouTubeUrl = `https://www.youtube.com/watch?v=${req.body.videoUrl}`;
      newItemData.youtubeLinks = [fullYouTubeUrl];
    }

    const newItem = new TimelineItem(newItemData);

    await newItem.save();
    console.log(
      "Successfully added new timeline item. Exiting addTimelineItem function."
    );
    res.json(newItem);
  } catch (err) {
    console.error(
      "Error in addTimelineItem. Exiting addTimelineItem function:",
      err.message
    );
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.updateTimelineItem = async (req, res) => {
  console.log("Entering updateTimelineItem function");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(
      "Validation errors found. Exiting updateTimelineItem function."
    );
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const item = await TimelineItem.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!item) {
      console.log("Item not found. Exiting updateTimelineItem function.");
      return res.status(404).json({ message: "Item not found" });
    }

    // Append the new YouTube URL to the youtubeLinks array only if it doesn't already exist
    if (req.body.videoUrl) {
      const fullYouTubeUrl = `https://www.youtube.com/watch?v=${req.body.videoUrl}`;
      if (!item.youtubeLinks.includes(fullYouTubeUrl)) {
        item.youtubeLinks.push(fullYouTubeUrl);
      }
    }

    // Update other fields
    Object.keys(req.body).forEach((key) => {
      if (key !== "videoUrl") {
        // Skip videoUrl as it's already handled
        item[key] = req.body[key];
      }
    });

    await item.save();
    console.log(
      "Successfully updated timeline item. Exiting updateTimelineItem function."
    );
    res.json(item);
  } catch (err) {
    console.error(
      "Error in updateTimelineItem. Exiting updateTimelineItem function:",
      err.message
    );
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.deleteTimelineItem = async (req, res) => {
  console.log("Entering deleteTimelineItem function");
  try {
    const item = await TimelineItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!item) {
      console.log("Item not found. Exiting deleteTimelineItem function.");
      return res.status(404).json({ message: "Item not found" });
    }

    console.log(
      "Successfully deleted timeline item. Exiting deleteTimelineItem function."
    );
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error(
      "Error in deleteTimelineItem. Exiting deleteTimelineItem function:",
      err.message
    );
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.updateTimeLine = async (req, res) => {
  try {
    const isExist = await TimelineItem.findOne({ _id: req.params.id });
    if (isExist) {
      const result = await TimelineItem.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        status: true,
        message: "TimelineItem Update successfully",
        data: result,
      });
    } else {
      res.status(201).json({
        status: true,
        message: "TimelineItem update unsuccessful",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: false,
      message: "TimelineItem update unsuccessful",
    });
  }
};
