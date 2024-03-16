// write a controller function to get all the Outlets from the database.
// for this first import the Outlet class from the models file Outlet.js

const Outlet = require("../models/outlet");
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const fs = require("fs");
(path = require("path")),
  (cors = require("cors")),
  (multer = require("multer"));
const url = require("url");

const DIR = "./uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {

    const outletId = req.params.id;
    // const fileName = `${eventId}_${file.originalname.toLowerCase().split(' ').join('-')}`;
    const fileExtension = file.originalname.toLowerCase().split(".").pop();
    const fileName = `${outletId}.${fileExtension}`;
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

const Images = require("../models/images");

// function to get all the Outlets.
async function handleGetAllOutlets(req, res) {
  const allDbOutlets = await Outlet.find({}).sort({outlet_id : -1});;
  return res.json(allDbOutlets);
}

async function handlePostInsights(
  outletId,
  outletIconFile,
  introVideoFile,
  requestBody
) {
  try {
    // Find the entity in the database
    const outlet = await Outlet.findOne({
      outlet_id: outletId,
    });

    if (!outlet) {
      throw new Error("Outlet not found");
    }

    const oldOutletIcon = `${DIR}${outlet.outlet_icon}`;

    if (fs.existsSync(oldOutletIcon)) {
      try {
        // Attempt to unlink (delete) the old file
        fs.unlinkSync(oldOutletIcon);
        console.log("Old file deleted successfully");
      } catch (error) {
        console.error("Error while unsyncing old file:", error.message);
      }
    } else {
      console.log("Old file not found. Skipping unsyncing.");
    }

    // If the Outlet already has an outlet icon, delete the old file

    const oldIntroVideoPath = `${DIR}${outlet.intro_video}`;

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

    // Update the Outlet's outlet icon and intro video paths with the new file names

    outlet.outlet_icon = outletIconFile
      ? `http://localhost:8000/uploads/${outletIconFile.filename}`
      : outlet.outlet_icon;
    outlet.intro_video = introVideoFile
      ? `http://localhost:8000/uploads/${introVideoFile.filename}`
      : outlet.intro_video;

    (outlet.opening_time = requestBody.opening_time || outlet.opening_time), // am pm
      (outlet.closing_time = requestBody.closing_time || outlet.closing_time),
      (outlet.outlet_category =
        requestBody.outlet_category || outlet.outlet_category),
      (outlet.address = requestBody.address || outlet.address);
    (outlet.website = requestBody.website || outlet.website),
      (outlet.facebook_url = requestBody.facebook_url || outlet.facebook_url),
      (outlet.instragram_url =
        requestBody.instragram_url || outlet.instragram_url),
      (outlet.google_url = requestBody.google_url || outlet.google_url),
      (outlet.description = requestBody.description || outlet.description),
      (outlet.map = requestBody.map || outlet.map);

    // Save the updated Outlet to the database
    await outlet.save();

    return {
      message: "Files updated successfully",
      outlet_icon: outlet.outlet_icon,
      outlet_video: outlet.intro_video,
    };
  } catch (error) {
    console.error("Error updating files:", error.message);
    throw new Error("Internal Server Error");
  }
}

// function to get the Outlet by id.
async function handleGetOutletById(req, res) {
  // first get the id enterd by the Outlet.
  const fetched_Outlet = await Outlet.findOne({
    outlet_id: req.params.id,
  });
  // if the Outlet if not found by the id.
  if (!fetched_Outlet) {
    return res.status(400).json({ error: "Outlet not found." });
  }
  // return the fetch Outlet from the database.
  return res.json(fetched_Outlet);
}



async function handleUpdateOutletById(req, res) {
  try {
    const body = req.body;
    if (body.outlet_icon) {
      const url = req.protocol + "://" + req.get("host");
      console.log(req.params.id);

      const uploads = new Images({
        id: req.params.id,
        icon: url + "/uploads/" + req.file.filename,
        image_type: "outlet_icon",
      });

      const savedUpload = await uploads.save();
      res.send(savedUpload);
    }
    const updatedOutlet = await Outlet.findByIdAndUpdate(
      req.params.id,
      req.body, // Use req.body to get the updated values from Postman or frontend
      { new: true, runValidators: true }
    );

    if (!updatedOutlet) {
      return res.status(404).json({ error: "Outlet not found." });
    }

    return res.json({ status: "Outlet updated successfully.", updatedOutlet });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}


async function handleCreateNewOutlet(req, res) {
  try {
    const body = req.body;
    if (
      !body.outlet_name ||
      !body.phone ||
      !body.email ||
      !body.password ||
      !body.address ||
      !body.opening_time ||
      !body.closing_time ||
      !body.outlet_category
    ) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }
    // now we will push the code into the mongodb database into the Outlets collection.
    const result = await Outlet.create({
      outlet_name: body.outlet_name,
      outlet_id: body.outlet_id,
      gender: body.gender, // dropdown
      dob: body.dob,
      phone: body.phone,
      email: body.email,
      password: body.password,
      address: body.address,
      website: body.website,
      opening_time: body.opening_time,
      closing_time: body.closing_time,
      social_handles: body.social_handles,
      outlet_icon: body.outlet_icon,
      outlet_category: body.outlet_category,
      description: body.description,
      linked_artists: body.linked_artists,
      map: body.map,
      authentication_status: body.authentication_status,
      feedback: body.feedback,
      requesthelp: body.requesthelp,
      invitelink: body.invitelink,
      outlet_profile_rules_and_regulation:
        body.outlet_profile_rules_and_regulation,
      outlet_license_acceptance: body.outlet_license_acceptance,
      intro_video: body.intro_video,
    });
    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Outlet has been created.
    return res
      .status(201)
      .json({ Message: "Outlet successfully created.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetOutletsbyType(req, res) {
  const type = req.params.type;

  const fetched_Outlets = await Outlet.find({
    outlet_category: type,
  });

  if (!fetched_Outlets || fetched_Outlets.length === 0) {
    return res.status(404).json({ error: "Outlet not found." });

    
  }

  const formattedOutlets = fetched_Outlets.map(outlet => ({
    id: outlet.outlet_id,
    name: outlet.outlet_name,
    image: outlet.outlet_icon,
    format: outlet.format // Assuming format is a property of the outlet object
  }));

  return res.json(formattedOutlets);

}

async function handleGetOutletbyCategory(req, res) {
  const category = req.params.category;
  const outlet_category = await Outlet.aggregate([
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
  if (!outlet_category) {
    return res.status(400).json({ error: "Outlets not found." });
  }
  // return the fetch Customer from the database.
  return res.json(outlet_category);
}

function isValidDateString(dateString) {
  const regex = /^[A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;
  return regex.test(dateString);
}

async function handleGetOutletsbyFilter(req, res) {
  const body = req.body;
  const filter = {};

  console.log("form date", body.fromDate);
  console.log("to date", body.endDate);

  // Construct filter object based on provided values
  if (body.outlet_category) filter.outlet_category = body.outlet_category;

  if (body.fromDate && body.endDate && isValidDateString(body.fromDate) && isValidDateString(body.endDate)) {
    filter.createdAt = {
      $gte: new Date(body.fromDate), // Greater than or equal to fromDate
      $lte: new Date(body.endDate)   // Less than or equal to endDate
    };
  }

  const allDbCustomers = await Outlet.find(filter).sort({outlet_id : -1});
  return res.json(allDbCustomers);

}

async function handleAuthentcateOutletById(req, res) {
  try {
    const authenticateOutlet = await Outlet.findOneAndUpdate(
      { outlet_id: req.params.id },
      { authentication_status: true }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!authenticateOutlet) {
      return res.status(404).json({ error: "Outlet not found." });
    }

    return res.json({
      status: "Outlet Authenticated Successfully.",
      authenticateOutlet,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleLimitOutletById(req, res) {
  try {
    const updatedOutlet = await Outlet.findOneAndUpdate(
      { outlet_id: req.params.id },
      { authentication_status: false }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!updatedOutlet) {
      return res.status(404).json({ error: "Outlet not found." });
    }

    return res.json({
      status: "Outlet Limited Successfully.",
      updatedOutlet,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleDeleteOutletById(req, res) {
  try {
    const deletedOutlet = await Outlet.findOneAndDelete({outlet_id : req.params.id});

    const deletedUser = await User.findOneAndDelete({userId : req.params.id});

    if (!deletedOutlet && !deletedUser) {
      return res.status(404).json({ error: "Outlet not found." });
    }

    return res.json({
      status: "Outlet deleted successfully.",
      deletedOutlet,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleNightcubeSetup(req, res) {
  try {
    const outlet = await Outlet.findOneAndUpdate(
      { outlet_id: req.params.id },
      {
        company_identification_number: req.body.company_identification_number,
        gstin: req.body.gstin,
        gst_percentage: req.body.gst_percentage,
        nightcube_setup:true
      }, 
      { new: true, runValidators: true }
    );
    if (!outlet) {
      return res.status(404).json({ error: "Outlet not found." });
    }

    return res.json({
      status: "Nightcube Setup Successful.",
      outlet,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handlePromoteOutletById(req, res) {
  try {
    const event = await Outlet.findOneAndUpdate(
      { outlet_id: req.params.id },
      { promote: req.params.status }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: "Outlet not found." });
    }

    return res.json({
      status: "Outlet Updated Successfully.",
      event,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetPromotedOutlets(req, res) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Outlet.find({
      promote: true,
    });

    // If the event is not found by the event_id.
    if (!fetchedEvent) {
      return res.status(404).json({ error: "Outlets not found." });
    }

    // Return the fetched event from the database.
    return res.json(fetchedEvent);
  } catch (error) {
    // Handle any unexpected errors.
    console.error("Error fetching outlets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleGetAllOutlets,
  handleGetOutletById,
  handleUpdateOutletById,
  handleDeleteOutletById,
  handleCreateNewOutlet,
  handlePostInsights,
  upload,
  handleGetOutletbyCategory,
  handleGetOutletsbyType,
  handleGetOutletsbyFilter,
  handleAuthentcateOutletById,
  handleNightcubeSetup,
  handleLimitOutletById,
  handleGetPromotedOutlets,
  handlePromoteOutletById
};
