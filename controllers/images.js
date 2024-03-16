const express = require("express");
const fs = require('fs');
const router = express.Router();
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
  // limits: {
  //   fileSize: 1024 * 1024 * 100
  // },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

const Images = require("../models/images");

router.get("/", async (req, res) => {
  const allImages = await Images.find({});
  return res.json(allImages);
});

router.get("/:id", async (req, res) => {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Images.find({ _id: req.params.id });

    // If the event is not found by the event_id.
    if (!fetchedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedEvent);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    // First get the event by the event_id entered by the user.
    const image = await Images.findByIdAndDelete({ _id: req.params.id });

    // If the event is not found by the event_id.
    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Return the fetched event from the database.
    return res.json(image);
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
    const validImageTypes = [
      "event_images",
      "ambience_images",
      "portrait_images",
    ];
    if (!validImageTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid image type." });
    }

    // Get the event by the event_id entered by the user and image_type.
    const fetchedImages = await Images.find({ id, image_type: type });

    // If the event is not found by the event_id.
    if (!fetchedImages) {
      return res.status(404).json({ error: "Images not found." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedImages);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching images:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", upload.array("icon", 15), async (req, res, next) => {
  try {
    const { id, image_type } = req.body;
    const icons = req.files.map((file) => {
      const url = req.protocol + "://" + req.get("host");
      return {
        id,
        icon: url + "/uploads/" + file.filename,
        image_type,
      };
    });

    // Save all icons to the database
    const savedIcons = await Images.insertMany(icons);

    res.send(savedIcons);
  } catch (err) {
    console.error("Error in saving icons:", err);
    res.status(500).send("Internal Server Error");
  }
});


router.put("/replace/:id", upload.single("icon"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = req.protocol + "://" + req.get("host");
    const iconUrl = url + "/uploads/" + req.file.filename;

    // Find the existing image by ID
    const existingImage = await Images.findOne({ _id: req.params.id });

    if (!existingImage) {
      return res.status(404).json({ error: "Image not found." });
    }

    // Delete the old image file
    const oldFilePath = existingImage.icon.replace(url + "/uploads/", "");
    fs.unlinkSync(path.join(DIR, oldFilePath));

    // Update the existing image with the new URL
    existingImage.icon = iconUrl;

    // Save the updated image to the database
    const updatedImage = await existingImage.save();

    return res.json(updatedImage);
  } catch (err) {
    console.error("Error in replacing image:", err);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
