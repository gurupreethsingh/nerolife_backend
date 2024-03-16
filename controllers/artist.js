// write a controller function to get all the Artists from the database.
// for this first import the Artist class from the models file Artist.js

const Artist = require("../models/artist");
const User = require("../models/user");
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
    const artistId = req.params.id;
    // const fileName = `${artistId}_${file.originalname.toLowerCase().split(' ').join('-')}`;
    const fileExtension = file.originalname.toLowerCase().split(".").pop();
    const fileName = `${artistId}.${fileExtension}`;
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

// function to get all the Artists.
async function handleGetAllArtists(req, res) {
  const allDbArtists = await Artist.find({});
  return res.json(allDbArtists);
}

// function to get the Artist by id.
async function handleGetArtistById(req, res) {
  // first get the id enterd by the Artist.
  const fetched_Artist = await Artist.findOne({ artist_id: req.params.id });
  // if the Artist if not found by the id.
  if (!fetched_Artist) {
    return res.status(400).json({ error: "Artist not found." });
  }
  // return the fetch Artist from the database.
  return res.json(fetched_Artist);
}

async function handlePostInsights(
  artisttId,
  artistIconFile,
  introVideoFile,
  requestBody
) {
  try {
    // Find the entity in the database
    const artist = await Artist.findOne({
      artist_id: artisttId,
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    const oldArtistIcon = artist.artist_profile_icon;

    if (fs.existsSync(oldArtistIcon)) {
      try {
        // Attempt to unlink (delete) the old file
        fs.unlinkSync(oldArtistIcon);
        console.log("Old file deleted successfully");
      } catch (error) {
        console.error("Error while unsyncing old file:", error.message);
      }
    } else {
      console.log("Old file not found. Skipping unsyncing.");
    }

    // If the artist already has an artist icon, delete the old file

    const oldIntroVideoPath = artist.artist_intro_video;

    const timestamp = Date.now();

    if (fs.existsSync(oldIntroVideoPath)) {
      try {
        // Attempt to unlink (delete) the old file
        fs.unlinkSync(oldIntroVideoPath);
        console.log("Old file deleted successfully");
      } catch (error) {
        console.error("Error while unsyncing old file:", error.message);
      }
    } else {
      console.log("Old file not found. Skipping unsyncing.");
    }

    // Update the Artist's Artist icon and intro video paths with the new file names

    artist.artist_profile_icon = artistIconFile
      ? `http://localhost:8000/uploads/${artistIconFile.filename}`
      : artist.artist_profile_icon;
    artist.artist_intro_video = introVideoFile
      ? `http://localhost:8000/uploads/${introVideoFile.filename}`
      : artist.artist_intro_video;
    (artist.artist_stage_name =
      requestBody.artist_stage_name || artist.artist_stage_name),
      (artist.website = requestBody.website || artist.website),
      (artist.facebook_url = requestBody.facebook_url || artist.facebook_url),
      (artist.instragram_url =
        requestBody.instragram_url || artist.instragram_url),
      (artist.soundcloud_url =
        requestBody.soundcloud_url || artist.soundcloud_url),
      (artist.youtube_url = requestBody.youtube_url || artist.youtube_url),
      (artist.artist_category =
        requestBody.artist_category || artist.artist_category),
      (artist.music_operations =
        requestBody.music_operations || artist.music_operations),
      (artist.description = requestBody.description || artist.description),
      (artist.artist_profile_disclaimer = requestBody.artist_profile_disclaimer || artist.artist_profile_disclaimer),
      // Save the updated Artist to the database
      await artist.save();

    return {
      message: "Artist Insights Updated Successfully",
    };
  } catch (error) {
    console.error("Error updating files:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function handleUpdateArtistById(req, res) {
  try {
    console.log("body", body);
    const updatedArtist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body, // Use req.body to get the updated values from Postman or frontend
      { new: true, runValidators: true }
    );

    if (!updatedArtist) {
      return res.status(404).json({ error: "Artist not found." });
    }

    return res.json({ status: "Artist updated successfully.", updatedArtist });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}



async function handleCreateNewArtist(req, res) {
  try {
    const body = req.body;
    if (
      !body.first_name ||
      !body.last_name ||
      !body.artist_name ||
      !body.artist_id ||
      !body.dob ||
      !body.password ||
      !body.email ||
      !body.phone ||
      !body.artist_category ||
      !body.music_operations
    ) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }
    // now we will push the code into the mongodb database into the Artists collection.
    const result = await Artist.create({
      first_name: body.first_name,
      last_name: body.last_name,
      artist_name: body.artist_name,
      artist_id: body.artist_id,
      dob: body.dob,
      phone: body.phone,
      email: body.email,
      website: body.website,
      password: body.password,
      age_group: body.age_group,
      social_handles: body.social_handles,
      artist_profile_icon: body.artist_profile_icon,
      artist_category: body.artist_category,
      music_operations: body.music_operations,
      description: body.description,
      linked_Artists: body.linked_Artists,
      authentication_status: body.authentication_status,
      feedback: body.feedback,
      requesthelp: body.requesthelp,
      invitelink: body.invitelink,
      artist_profile_disclaimer: body.artist_profile_disclaimer,
      artist_license_acceptance: body.artist_license_acceptance,
      artist_intro_video: body.artist_intro_video,
    });
    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Artist has been created.
    return res
      .status(201)
      .json({ Message: "Artist successfully created.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetArtistbyCategory(req, res) {
  const category = req.params.category;
  const artist_category = await Artist.aggregate([
    {
      $group: {
        _id: `$${category}`,
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);
  // if the Customer if not found by the id.
  if (!artist_category) {
    return res.status(400).json({ error: "Artists not found." });
  }
  // return the fetch Customer from the database.
  return res.json(artist_category);
}

function isValidDateString(dateString) {
  const regex = /^[A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;
  return regex.test(dateString);
}


async function handleGetCustomersbyFilter(req, res) {
  const body = req.body;
  const filter = {};

  console.log("form date", body.fromDate);
  console.log("to date", body.endDate);

  // Construct filter object based on provided values
  if (body.artist_category) filter.artist_category = body.artist_category;
  if (body.music_operations) filter.music_operations = body.music_operations;

  if (body.fromDate && body.endDate && isValidDateString(body.fromDate) && isValidDateString(body.endDate)) {
    filter.createdAt = {
      $gte: new Date(body.fromDate), // Greater than or equal to fromDate
      $lte: new Date(body.endDate)   // Less than or equal to endDate
    };
  }


  const allArtists = await Artist.find(filter).sort({artist_id : -1});


  return res.json(allArtists);
}

async function handleAuthentcateArtistById(req, res) {
  try {
    const authenticateArtist = await Artist.findOneAndUpdate(
      { artist_id: req.params.id },
      { authentication_status: true }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!authenticateArtist) {
      return res.status(404).json({ error: "Artist not found." });
    }

    return res.json({
      status: "Artist Authenticated Successfully.",
      authenticateArtist,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleLimitArtistById(req, res) {
  try {
    const updatedArtist = await Artist.findOneAndUpdate(
      { artist_id: req.params.id },
      { authentication_status: false }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!updatedArtist) {
      return res.status(404).json({ error: "Artist not found." });
    }

    return res.json({
      status: "Artist Limited Successfully.",
      updatedArtist,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleDeleteArtistById(req, res) {
  try {
    const deletedArtist = await Artist.findOneAndDelete({artist_id : req.params.id});

    const deletedUser = await User.findOneAndDelete({userId : req.params.id});

    if (!deletedArtist && !deletedUser) {
      return res.status(404).json({ error: "Artist not found." });
    }

    return res.json({
      status: "Artist deleted successfully.",
      deletedArtist,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handlePromoteArtistById(req, res) {
  try {
    const event = await Artist.findOneAndUpdate(
      { artist_id: req.params.id },
      { promote: req.params.status }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: "Artist not found." });
    }

    return res.json({
      status: "Artist Updated Successfully.",
      event,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetPromotedArtists(req, res) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedArtist = await Artist.find({
      promote: true,
    });

    // If the event is not found by the event_id.
    if (!fetchedArtist) {
      return res.status(404).json({ error: "Artist not found." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedArtist);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching artists:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleGetAllArtists,
  handleGetArtistById,
  handleUpdateArtistById,
  handleDeleteArtistById,
  handleCreateNewArtist,
  handlePostInsights,
  upload,
  handleGetArtistbyCategory,
  handleGetCustomersbyFilter,
  handleAuthentcateArtistById,
  handleLimitArtistById,
  handlePromoteArtistById,
  handleGetPromotedArtists
};
