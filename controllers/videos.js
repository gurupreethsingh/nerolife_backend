const express = require("express");
const router = express.Router();
const fs = require('fs');
(path = require("path")),
  (cors = require("cors")),
  (multer = require("multer"));
const ObjectId = require("mongoose").Types.ObjectId;

const DIR = "./uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
});

const Videos = require("../models/videos.js");

router.post("/", upload.array("video_url", 15), async (req, res, next) => {
  try {
    const { id, video_type } = req.body;
    const videos = req.files.map((file) => {
      const url = req.protocol + "://" + req.get("host");
      return {
        id,
        video_url: url + "/uploads/" + file.filename,
        video_type,
      };
    });

    // Save all icons to the database
    const savedVideos = await Videos.insertMany(videos);

    res.send(savedVideos);
  } catch (err) {
    console.error("Error in saving videos:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/", async (req, res) => {
  const allVideos = await Videos.find({});
  return res.json(allVideos);
});

router.get("/:id", async (req, res) => {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedVideos = await Videos.find({ id: req.params.id });

    // If the event is not found by the event_id.
    if (!fetchedVideos) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedVideos);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    // Validate image type
    const validVideoTypes = [
      "event_videos",
      "experience_videos",
      "show_videos",
    ];
    if (!validVideoTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid video type." });
    }

    // Get the event by the event_id entered by the user and image_type.
    const fetchedVideos = await Videos.find({ id, video_type: type });

    // If the event is not found by the event_id.
    if (!fetchedVideos) {
      return res.status(404).json({ error: "Video not found." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedVideos);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching videos:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    // First get the event by the event_id entered by the user.
    const video = await Videos.findByIdAndDelete({ _id: req.params.id });

    // If the event is not found by the event_id.
    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    // Return the fetched event from the database.
    return res.json(video);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/replace/:id", upload.single("video_url"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = req.protocol + "://" + req.get("host");
    const video_url = url + "/uploads/" + req.file.filename;

    // Find the existing image by ID
    const existingVideo = await Videos.findOne({ _id: req.params.id });

    if (!existingVideo) {
      return res.status(404).json({ error: "Video not found." });
    }

    // Delete the old image file
    const oldFilePath = existingVideo.video_url.replace(url + "/uploads/", "");
    fs.unlinkSync(path.join(DIR, oldFilePath));

    // Update the existing image with the new URL
    existingVideo.video_url = video_url;

    // Save the updated image to the database
    const updatedVideo = await existingVideo.save();

    return res.json(updatedVideo);
  } catch (err) {
    console.error("Error in replacing image:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
