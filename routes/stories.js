const express = require("express");
const {
    handleGetAllStories,
    upload,
    handlePostStories,
    handleUpdateStory,
    handleDeleteStoryById
} = require("../controllers/stories");

const router = express.Router();

router.route("/").get(handleGetAllStories);

router.route("/post").post(
    upload.fields([
      { name: "picture", maxCount: 1 },
    ]),
    handlePostAttributes
  );


  router.route("/update/:id").put(
    upload.fields([
      { name: "picture", maxCount: 1 },
    ]),
    handleUpdateAttributes
  )

  router.route("/delete/:id").delete(
    handleDeleteStoryById
  )

module.exports = router;

async function handleUpdateAttributes(req, res) {
  try {
    console.log("body", req.body)
    const picture = req.files && req.files["picture"] ? req.files["picture"][0] : null;

    // Use the function to update the entity with the uploaded files
    const result = await handleUpdateStory(
      picture,
      req.body,
      req.params.id,
      req,
      res
    );
   

  } catch (error) {
    console.error("Error in route:", error.message);
  
  }
}

async function handlePostAttributes(req, res) {
    try {
      const picture = req.files && req.files["picture"] ? req.files["picture"][0] : null;
    
      const result = await handlePostStories(
        picture,
        req.body,
        res
      );

    } catch (error) {
      console.error("Error in route:", error.message);
    }
  }

