const express = require("express");
const {
    handleGetAllRoas,
    handleGetRoasbyType,
    handleUpdateRoas,
    handlePostRoas,
    handleUpdateLinks
} = require("../controllers/roas");

const router = express.Router();

router.route("/").get(handleGetAllRoas).post(handlePostRoas);

router.route("/type/:type").get(handleGetRoasbyType);

router.route("/update/:id").patch(handleUpdateRoas);

router.route("/updateLinks/:id").patch(handleUpdateLinks);

module.exports = router;
