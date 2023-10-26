const mongoose = require('mongoose');

const TimelineItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Added an index for faster queries by userId
  },
  year: {
    type: Number,
    required: true,
    min: 1900, // Example: Ensure year is not earlier than 1900
    max: new Date().getFullYear(), // Ensure year is not in the future
  },
  bandNames: [{
    type: String,
    trim: true, // Remove any extra spaces
    maxlength: 100, // Example max length
  }],
  songNames: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
  searchField: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  spotifyLinks: [{
    type: String,
    trim: true,
    // Example: Simple URL validation
    match: /^https?:\/\/(www\.)?spotify\.com\//,
  }],
  youtubeLinks: [{
    type: String,
    trim: true,
    match: /^https?:\/\/(www\.)?youtube\.com\//,
  }],
  myStory: {
    type: String,
    default: '',
    trim: true,
    maxlength: 10000,
  },
});

const TimelineItem = mongoose.model('TimelineItem', TimelineItemSchema);
module.exports = TimelineItem;
