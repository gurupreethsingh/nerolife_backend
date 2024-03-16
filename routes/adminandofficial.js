const express = require("express");
const {
    handleGetAllAdminsAndOfficial
} = require("../controllers/adminandofficial");

const router = express.Router();

router.route("/").get(handleGetAllAdminsAndOfficial);

module.exports = router;



