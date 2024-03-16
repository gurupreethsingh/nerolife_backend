const express = require("express");
const {
    handlegetLinkage,
    handlePostLinkage,
    handlegetAvailableArtists,
    handlegetAvailableOutlets,
    handleDeleteLinkage,
    handlegetLinkedArtists,
    handlegetLinkedOutlets,
    handlegetResidentArtists,
    handlegetResidentOutlets
} = require("../controllers/artistoutletsync");

const router = express.Router();

router.route("/").get(handlegetLinkage).post(handlePostLinkage);

router.route("/getAvailableArtists").get(handlegetAvailableArtists);

router.route("/getLinkedArtists").get(handlegetLinkedArtists);

router.route("/getAvailableOutlets").get(handlegetAvailableOutlets);

router.route("/getLinkedOutlets").get(handlegetLinkedOutlets);

router.route("/getResidentArtists/:outlet_id").get(handlegetResidentArtists);

router.route("/getResidentOutlets/:artist_id").get(handlegetResidentOutlets);

router.route("/deleteLinkage/:artist_id/:outlet_id").delete(handleDeleteLinkage);


module.exports = router;