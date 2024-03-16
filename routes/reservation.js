const express = require("express");

const {
  handlePostReservation,
  handleGetAllReservedEvents,
  handleGetReservationByEventId,
  handleGetReservationByUserId,
  handleGetReservationByOutletId,
  handleCheckReservation,
} = require("../controllers/reservation");

const router = express.Router();

router.route("/").get(handleGetAllReservedEvents).post(handlePostReservation);

router
  .route("/check_reservation/:event_id/:user_id")
  .get(handleCheckReservation);

router.route("/byeventid/:event_id").get(handleGetReservationByEventId);
router.route("/byoutletid/:outlet_id").get(handleGetReservationByOutletId);

router.route("/byuserid/:user_id").get(handleGetReservationByUserId);

module.exports = router;
