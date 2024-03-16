const express = require("express");
const {
  handleGetAllArtists,
  handleGetArtistById,
  handleUpdateArtistById,
  handleDeleteArtistById,
  handleCreateNewArtist,
  upload,
  handlePostInsights,
  handleGetArtistbyCategory,
  handleGetCustomersbyFilter,
  handleAuthentcateArtistById,
  handleLimitArtistById,
  handlePromoteArtistById,
  handleGetPromotedArtists
} = require("../controllers/artist");

const router = express.Router();

router.route("/").get(handleGetAllArtists).post(handleCreateNewArtist);

router.route("/insights/:id").patch(
  upload.fields([
    { name: "artist_profile_icon", maxCount: 1 },
    { name: "artist_intro_video", maxCount: 1 },
  ]),
  handlePostAttributes
);

router.route("/category/:category").get(handleGetArtistbyCategory);

router.route("/filter").post(handleGetCustomersbyFilter);

router.route("/authenticate/:id").patch(handleAuthentcateArtistById);

router.route("/limit/:id").patch(handleLimitArtistById);

router.route("/promoted").get(handleGetPromotedArtists);

router.route("/handlePromote/:id/:status").patch(handlePromoteArtistById);

router
  .route("/:id")
  .get(handleGetArtistById)
  .patch(handleUpdateArtistById)
  .delete(handleDeleteArtistById);

module.exports = router;

async function handlePostAttributes(req, res) {
  try {
    const artistId = req.params.id;
    const outletIconFile =
      req.files && req.files["artist_profile_icon"]
        ? req.files["artist_profile_icon"][0]
        : null;
    const introVideoFile =
      req.files && req.files["artist_intro_video"]
        ? req.files["artist_intro_video"][0]
        : null;

    // Use the function to update the entity with the uploaded files
    const result = await handlePostInsights(
      artistId,
      outletIconFile,
      introVideoFile,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in route:", error.message);
    res.status(500).json({ error: error.message });
  }
}
