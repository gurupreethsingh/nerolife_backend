const express = require("express");
const multer = require("multer");
const fs = require("fs");

const {
  handleGetAllOutlets,
  handleGetOutletById,
  handleUpdateOutletById,
  handleDeleteOutletById,
  handleCreateNewOutlet,
  handlePostInsights,
  upload,
  handleGetOutletbyCategory,
  handleGetOutletsbyType,
  handleGetOutletsbyFilter,
  handleAuthentcateOutletById,
  handleNightcubeSetup,
  handleLimitOutletById,
  handleGetPromotedOutlets,
  handlePromoteOutletById
} = require("../controllers/outlet");

const router = express.Router();

// const { upload, updateEntityWithFiles } = require("./uploadAndSaveFile"); // Import the upload middleware and updateEntityWithFiles function

router.route("/").get(handleGetAllOutlets).post(handleCreateNewOutlet);

router.route("/insights/:id").patch(
  upload.fields([
    { name: "outlet_icon", maxCount: 1 },
    { name: "intro_video", maxCount: 1 },
  ]),
  handlePostAttributes
);

router.route("/category/:category").get(handleGetOutletbyCategory);
router.route("/type/:type").get(handleGetOutletsbyType);

router.route("/filter/").post(handleGetOutletsbyFilter);

router.route("/authenticate/:id").patch(handleAuthentcateOutletById);

router.route("/nightcube/:id").patch(handleNightcubeSetup);

router.route("/limit/:id").patch(handleLimitOutletById);

router.route("/promoted").get(handleGetPromotedOutlets);

router.route("/handlePromote/:id/:status").patch(handlePromoteOutletById);

router
  .route("/:id")
  .get(handleGetOutletById)
  .patch(handleUpdateOutletById)
  .delete(handleDeleteOutletById);

module.exports = router;

async function handlePostAttributes(req, res) {
  try {
    const outletId = req.params.id;
    const outletIconFile =
      req.files && req.files["outlet_icon"]
        ? req.files["outlet_icon"][0]
        : null;
    const introVideoFile =
      req.files && req.files["intro_video"]
        ? req.files["intro_video"][0]
        : null;

    // Use the function to update the entity with the uploaded files
    const result = await handlePostInsights(
      outletId,
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
