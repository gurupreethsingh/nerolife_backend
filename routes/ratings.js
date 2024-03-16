const express = require("express");
const {
    handleGetAllRatings,
    handlePostRatings,
    handleCheckReview
} = require("../controllers/ratings");

const router = express.Router();
router.route("/").get(handleGetAllRatings);

router.route("/:category").post(handlePostRatings);

router.route("/checkReview/:fromId/:toId").get(handleCheckReview);

module.exports = router;