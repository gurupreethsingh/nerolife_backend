const express = require("express");
const {
    handleGetAllDocuments,
    incrementCategory,
    handlePostDocuments
} = require("../controllers/documentcount");

const router = express.Router();
router.route("/").get(handleGetAllDocuments);

router.route("/").post(handlePostDocuments);

router.route("/:category").patch(incrementCategory);

module.exports = router;


