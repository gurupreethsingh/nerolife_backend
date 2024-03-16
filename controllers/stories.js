// write a controller function to get all the Outlets from the database.
// for this first import the Outlet class from the models file Outlet.js

const Stories = require("../models/stories");
const express = require("express");
const router = express.Router();
const fs = require("fs");
(path = require("path")),
  (cors = require("cors")),
  (multer = require("multer"));

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

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 100
  // },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime"];

    if (
      allowedImageTypes.includes(file.mimetype) ||
      allowedVideoTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error(
          "Only image (png, jpg, jpeg) and video (mp4, mpeg, quicktime) formats allowed!"
        )
      );
    }
  },
});

async function handleGetAllStories(req, res){
    const allStories = await Stories.find({});
    return res.json(allStories);
}

async function handlePostStories(picture, body, res) {
    const result = await Stories.create({ 
        image_url: `http://localhost:8000/uploads/${picture.filename}`, 
        message: body.message,
      });

    return res.status(200).json({message: "Stories Added Succesfully"})

}

async function handleUpdateStory(storyImage, body, storyId, req, res) {
  try {
    console.log("updating ...", storyId);
    const updatedData = body;
    console.log("body ", body);
    const url = req.protocol + "://" + req.get("host");

    
   
    if (storyImage) {
      const existingStory = await Stories.findOne({ _id: storyId });
      const oldFilePath = existingStory.image_url.replace(url + "/uploads/", "");

      if(oldFilePath){
        fs.unlinkSync(path.join(DIR, oldFilePath));
      }
      
      updatedData.image_url = `http://localhost:8000/uploads/${storyImage.filename}`;
    }


    const updatedEvent = await Stories.findOneAndUpdate(
      { _id: storyId },
      updatedData, // Use req.body to get the updated values from Postman or frontend
      { new: true, runValidators: true }
    );


    console.log("Updated Event: ", updatedEvent);

    if (!updatedEvent) {
      console.log("error");
    }
    console.log("updated");
    return res.status(200).json({message: "Stories Updated Succesfully"})

  } catch (error) {
    console.log(error);
  }
}

async function handleDeleteStoryById(req, res) {
  try {
    const deletedStory = await Stories.findOneAndDelete({_id : req.params.id});

  
    if (!deletedStory) {
      return res.status(404).json({ error: "Story not found." });
    }

    return res.status(200).json({
      status: "Story deleted successfully.",
      deletedStory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
  







module.exports = {
    handleGetAllStories,
    upload,
    handlePostStories,
    handleUpdateStory,
    handleDeleteStoryById
};

