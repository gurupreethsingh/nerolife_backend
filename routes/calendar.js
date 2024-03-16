const express = require("express");
const {
  handleGetAllCalendars,
  handleGetCalendarById,
  handleUpdateCalendarById,
  handleDeleteCalendarById,
  handleCreateNewCalendar,
  handlePostNewCalendar,
  handleGetCalendarByArtistId
} = require("../controllers/calendar");

const router = express.Router();

router.route("/").get(handleGetAllCalendars).post(handlePostNewCalendar);

router.route("/artist/:id").get(handleGetCalendarByArtistId);

router
  .route("/:id")
  .get(handleGetCalendarById)
  .patch(handleUpdateCalendarById)
  .delete(handleDeleteCalendarById);

module.exports = router;
