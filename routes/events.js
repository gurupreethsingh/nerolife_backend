const express = require("express");
const {
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEventById,
  handleDeleteEventById,
  handleCreateNewEvent,
  previousEvents,
  liveEvents,
  upcomingEvents,
  previousEventsByOutletId,
  upcomingEventsByOutletId,
  liveEventsByOutletId,
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
} = require("../controllers/events");

const router = express.Router();

router.route("/").get(handleGetAllEvents).post(handleCreateNewEvent);

router.route("/add_event/:id").post(
  upload.fields([
    { name: "poster_url", maxCount: 1 },
    { name: "intro_video", maxCount: 1 },
  ]),
  handlePostAttributes
);

router.route("/previous_events").get(previousEvents);
router.route("/live_events").get(liveEvents);
router.route("/upcoming_events").get(upcomingEvents);

router.route("/previous_events/:id").get(previousEventsByOutletId);
router.route("/live_events/:id").get(liveEventsByOutletId);
router.route("/upcoming_events/:id").get(upcomingEventsByOutletId);

router.route("/artist/previous_events/:id").get(previousEventsByArtistId);
router.route("/artist/live_events/:id").get(liveEventsByArtistId);
router.route("/artist/upcoming_events/:id").get(upcomingEventsByArtistId);


router.route("/promoted").get(handleGetPromotedEvents);


router.route("/filter").post(handleGetEventsbyFilter);

router
  .route("/previous_eventsbymusic/:music_category")
  .get(previousEventsByMusicCategory);
router
  .route("/live_eventsbymusic/:music_category")
  .get(liveEventsByMusicCategory);
router
  .route("/upcoming_eventsbymusic/:music_category")
  .get(upcomingEventsByMusicCategory);

router.route("/outlet/:outlet_id").get(handleGetEventByOutletId);
router.route("/artist/:artist_id").get(handleGetEventByArtistId);

router.route("/category/:category").get(handleGetEventbyCategory);

router.route("/handlePromote/:id/:status").patch(handlePromoteEventById);

router
  .route("/:id")
  .get(handleGetEventById)
  .put(
    upload.fields([
      { name: "poster_url", maxCount: 1 },
      { name: "intro_video", maxCount: 1 },
    ]),
    handleUpdateAttributes
  )
  .delete(handleDeleteEventById);

module.exports = router;

async function handleUpdateAttributes(req, res) {
  try {
    console.log("body", req.body)
    const eventPoster = req.files && req.files["poster_url"] ? req.files["poster_url"][0] : null;
    const introVideoFile = req.files && req.files["intro_video"]
        ? req.files["intro_video"][0]
        : null;

    // Use the function to update the entity with the uploaded files
    const result = await handleUpdateEventById(
      eventPoster,
      introVideoFile,
      req.body,
      req.params.id
    );
    res.status(200).json(result);

  } catch (error) {
    console.error("Error in route:", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function handlePostAttributes(req, res) {
  try {
    const eventPoster =
      req.files && req.files["poster_url"] ? req.files["poster_url"][0] : null;
    const introVideoFile =
      req.files && req.files["intro_video"]
        ? req.files["intro_video"][0]
        : null;

    // Use the function to update the entity with the uploaded files
    const result = await handlePostEvents(
      eventPoster,
      introVideoFile,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in route:", error.message);
    res.status(500).json({ error: error.message });
  }
}
