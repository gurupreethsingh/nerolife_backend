// write a controller function to get all the Events from the database.
// for this first import the Event class from the models file Event.js

const Event = require("../models/events");
const Calendar = require("../models/calendar");

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
    const eventId = req.params.id;
    // const fileName = `${eventId}_${file.originalname.toLowerCase().split(' ').join('-')}`;
    const fileExtension = file.originalname.toLowerCase().split(".").pop();
    const fileName = `${eventId}.${fileExtension}`;
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

async function handlePostEvents(eventPostrer, introVideoFile, body) {
  try {
    // Update the Outlet's outlet icon and intro video paths with the new file names

    console.log("Received artist_lineup:", body.artist_lineup);

    const result = await Event.create({
      event_id: body.event_id,
      event_name: body.event_name,
      outlet_id: body.outlet_id,
      outlet_name: body.outlet_name,
      artist_lineup: JSON.parse(body.artist_lineup),
      event_start_time: body.event_start_time, // manually entry
      event_end_time: body.event_end_time, // manually entry
      music_category: body.music_category, // dropdown
      event_category: body.event_category, // dropdown
      event_location_map: body.event_location_map,
      event_address: body.event_address, //outlet address
      description: body.description,
      event_price: body.event_price, // price option
      event_disclaimer: body.event_disclaimer,

      poster_url: `http://localhost:8000/uploads/${eventPostrer.filename}`,
      intro_video: `http://localhost:8000/uploads/${introVideoFile.filename}`,

      ticket_link: body.ticket_link,
    });

    await Calendar.create({
      event_id: body.event_id,
      event_name: body.event_name,
      outlet_id: body.outlet_id,
      outlet_name: body.outlet_name,
      artist_lineup: JSON.parse(body.artist_lineup),
      event_location_map: body.event_location_map,
      event_start_time: body.event_start_time, // manually entry
      event_end_time: body.event_end_time, // manually entry
      music_category: body.music_category, // dropdown
      event_category: body.event_category, // dropdown
      event_address: body.event_address, //outlet address
      description: body.description,
    });

    return {
      message: "Event Listed Successfully",
    };
  } catch (error) {
    console.error("Error Adding Event:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function handleUpdateEventById(eventPostrer, introVideoFile, body, eventId) {
  try {
    console.log("updating ...", eventId);
    const updatedData = body;
    console.log("body ", body);

    if (updatedData.artist_lineup) {
      updatedData.artist_lineup = JSON.parse(updatedData.artist_lineup);
    }

    if (eventPostrer) {
      updatedData.poster_url = `http://localhost:8000/uploads/${eventPostrer.filename}`;
    }

    if (introVideoFile) {
      updatedData.intro_video = `http://localhost:8000/uploads/${introVideoFile.filename}`;
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { event_id: eventId },
      updatedData, // Use req.body to get the updated values from Postman or frontend
      { new: true, runValidators: true }
    );

    const updatedCalendar = await Calendar.findOneAndUpdate(
      { event_id: eventId },
      {
        event_name: updatedData.event_name,
        artist_lineup: JSON.parse(updatedData.artist_lineup),
        event_start_time: updatedData.event_start_time, // manually entry
        event_end_time: updatedData.event_end_time, // manually entry
        music_category: updatedData.music_category, // dropdown
        event_category: updatedData.event_category, // dropdown
        event_address : updatedData.event_address,
        description: updatedData.description

      }, // Use req.body to get the updated values from Postman or frontend
      { new: true, runValidators: true }
    );

    console.log("Updated Event: ", updatedEvent);

    if (!updatedEvent) {
      console.log("error");
    }
    console.log("updated");
  } catch (error) {
    console.log(error);
  }
}

// function to get all the Events.
async function handleGetAllEvents(req, res) {
  const allDbEvents = await Event.find({});
  return res.json(allDbEvents);
}


async function handleGetEventById(req, res) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Event.findOne({ event_id: req.params.id });

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
}

async function previousEvents(req, res) {
  try {
    const docs = await Event.find({ event_end_time: { $lt: new Date() } });
    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Events: " + JSON.stringify(err, null, 2));
  }
}

async function previousEventsByMusicCategory(req, res) {
  try {
    const { music_category } = req.params;

    console.log("music-category", music_category);

    const formattedCategory = music_category.replace(/-/g, "/");

    console.log("formatted category : ", formattedCategory);

    const docs = await Event.find({
      music_category: formattedCategory,
      event_end_time: { $lt: new Date() },
    });

    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function liveEvents(req, res) {
  try {
    const docs = await Event.find({
      $and: [
        { event_start_time: { $lte: new Date() } },
        { event_end_time: { $gte: new Date() } },
      ],
    });
    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Events: " + JSON.stringify(err, null, 2));
    res.status(500).send("Internal Server Error"); // Optionally, send an error response to the client
  }
}

async function liveEventsByMusicCategory(req, res) {
  try {
    const { music_category } = req.params;

    console.log("music-category", music_category);

    const formattedCategory = music_category.replace(/-/g, "/");

    console.log("formatted category : ", formattedCategory);

    const docs = await Event.find({
      music_category: formattedCategory,
      event_start_time: { $lte: new Date() },
      event_end_time: { $gte: new Date() },
    });

    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function upcomingEvents(req, res) {
  try {
    const docs = await Event.find({ event_start_time: { $gt: new Date() } });
    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Events: " + JSON.stringify(err, null, 2));
    res.status(500).send("Internal Server Error");
  }
}

async function upcomingEventsByMusicCategory(req, res) {
  try {
    const { music_category } = req.params;

    console.log("music-category", music_category);

    const formattedCategory = music_category.replace(/-/g, "/");

    console.log("formatted category : ", formattedCategory);

    const docs = await Event.find({
      music_category: formattedCategory,
      event_start_time: { $gt: new Date() },
    });

    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function previousEventsByOutletId(req, res) {
  try {
    const docs = await Event.find({
      $and: [
        { outlet_id: req.params.id },
        { event_end_time: { $lt: new Date() } },
      ],
    });

    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function liveEventsByOutletId(req, res) {
  try {
    const docs = await Event.find({
      $and: [
        { outlet_id: req.params.id },
        { event_start_time: { $lte: new Date() } },
        { event_end_time: { $gte: new Date() } },
      ],
    });

    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function upcomingEventsByOutletId(req, res) {
  try {
    const docs = await Event.find({
      $and: [
        { outlet_id: req.params.id },
        { event_start_time: { $gt: new Date() } },
      ],
    });

    if (docs.length > 0) {
      res.send(docs);
    } else {
      res
        .status(404)
        .send(`No records found with the given id: ${req.params.id}`);
    }
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}


async function previousEventsByArtistId(req, res) {
  try {
    const docs = await Event.find({
      $and: [
        { "artist_lineup.id": req.params.id },
        { event_end_time: { $lt: new Date() } },
      ],
    });

    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function liveEventsByArtistId(req, res) {
  try {
    const docs = await Event.find({
      $and: [
        { "artist_lineup.id": req.params.id },
        { event_start_time: { $lte: new Date() } },
        { event_end_time: { $gte: new Date() } },
      ],
    });

    res.send(docs);
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function upcomingEventsByArtistId(req, res) {
  try {
    const docs = await Event.find({
      $and: [
        { "artist_lineup.id": req.params.id},
        { event_start_time: { $gt: new Date() } },
      ],
    });

    if (docs.length > 0) {
      res.send(docs);
    } else {
      res
        .status(404)
        .send(`No records found with the given id: ${req.params.id}`);
    }
  } catch (err) {
    console.log("Error in Retrieving Properties:", err);
    res.status(500).send("Internal Server Error");
  }
}





async function handleDeleteEventById(req, res) {
  try {
    const deletedEvent = await Event.findOneAndDelete({event_id : req.params.id});

    const deletedCalendar = await Calendar.findOneAndDelete({event_id : req.params.id});

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.json({
      status: "Event deleted successfully.",
      deletedEvent,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleCreateNewEvent(req, res) {
  try {
    const body = req.body;
    if (!body.event_name || !body.outlet_name || !body.event_address) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }
    // now we will push the code into the mongodb database into the Events collection.
    const result = await Event.create({
      event_id: body.event_id,
      event_name: body.event_name,
      outlet_id: body.outlet_id,
      outlet_name: body.outlet_name,
      artist_lineup: body.artist_lineup,
      event_start_time: body.event_start_time, // manually entry
      event_end_time: body.event_end_time, // manually entry
      music_category: body.music_category, // dropdown
      event_category: body.event_category, // dropdown
      event_location_map: body.event_location_map,
      event_address: body.event_address, //outlet address
      description: body.description,
      event_price: body.event_price, // price option
      event_disclaimer: body.event_disclaimer,

      poster_url: body.poster_url, // Add poster_url field
      intro_video: body.intro_video, // Add intro_video field

      ticket_link: body.ticket_link,
    });
    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Event has been created.
    return res
      .status(201)
      .json({ Message: "Event successfully created.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

//get event by outlet Id
async function handleGetEventByOutletId(req, res) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Event.find({
      outlet_id: req.params.outlet_id,
    });

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
}

async function handleGetEventByArtistId(req, res) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Calendar.find({
      "artist_lineup.id": req.params.artist_id,
    });

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
}

async function handleGetEventbyCategory(req, res) {
  const category = req.params.category;
  const event_category = await Event.aggregate([
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
  if (!event_category) {
    return res.status(400).json({ error: "Events not found." });
  }
  // return the fetch Customer from the database.
  return res.json(event_category);
}

function isValidDateString(dateString) {
  const regex = /^[A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;
  return regex.test(dateString);
}

async function handleGetEventsbyFilter(req, res) {
  const body = req.body;
  const filter = {};

  console.log("form date", body.fromDate);
  console.log("to date", body.endDate);

  // Construct filter object based on provided values
  if (body.music_category) filter.music_category = body.music_category;
  if (body.event_category) filter.event_category = body.event_category;

  if (body.fromDate && body.endDate && isValidDateString(body.fromDate) && isValidDateString(body.endDate)) {
    filter.createdAt = {
      $gte: new Date(body.fromDate), // Greater than or equal to fromDate
      $lte: new Date(body.endDate)   // Less than or equal to endDate
    };
  }

  const allDbCustomers = await Event.find(filter).sort({event_id : -1});;


  return res.json(allDbCustomers);
}

async function handlePromoteEventById(req, res) {
  try {
    const event = await Event.findOneAndUpdate(
      { event_id: req.params.id },
      { promote: req.params.status }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.json({
      status: "Event Updated Successfully.",
      event,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetPromotedEvents(req, res) {
  try {
    // First get the event by the event_id entered by the user.
    const fetchedEvent = await Event.find({
      promote: true,
    });

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
}

module.exports = {
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEventById,
  handleDeleteEventById,
  handleCreateNewEvent,
  previousEvents,
  liveEvents,
  upcomingEvents,
  previousEventsByOutletId,
  liveEventsByOutletId,
  upcomingEventsByOutletId,
  previousEventsByMusicCategory,
  liveEventsByMusicCategory,
  upcomingEventsByMusicCategory,
  upload,
  handlePostEvents,
  handleGetEventByOutletId,
  handleGetEventByArtistId,
  handleGetEventbyCategory,
  handleGetEventsbyFilter,
  handlePromoteEventById,
  handleGetPromotedEvents,
  previousEventsByArtistId,
  liveEventsByArtistId,
  upcomingEventsByArtistId
};
