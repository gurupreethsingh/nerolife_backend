const express = require("express");
const {
    handleGetAllPos,
    handlePostPos,
    handleGetPosbyOutlet,
    handleGetPosbyTransactionId,
    handleUpdatePos
} = require("../controllers/pos");

const router = express.Router();
router.route("/").get(handleGetAllPos).post(handlePostPos);

router.route("/outlet/:outlet_id").get(handleGetPosbyOutlet);

router.route("/byTransaction/:transaction_id").get(handleGetPosbyTransactionId);

router.route("/update/:transaction_id").patch(handleUpdatePos);

module.exports = router;
