const express = require("express");
const {
  handleGetAllCustomers,
  handleGetCustomerById,
  handleUpdateCustomerById,
  handleDeleteCustomerById,
  handleCreateNewCustomer,
  register,
  login,
  refresh,
  handleGetCustomerbyCategory,
  handleGetCustomersbyFilter,
  handleAuthentcateCustomerById,
  handlePostServey,
  handleGetCustomerbySurvey,
  handleGetCustomerByContact,
  handleGetCustomerByEmail,
  handleGetCustomerByOutletId,
  handleLimitCustomerById,
  handleUpdateProfilePic,
  upload,
  handleGetCustomersServeybyFilter
} = require("../controllers/customer");

const router = express.Router();

router.route("/").get(handleGetAllCustomers).post(handleCreateNewCustomer);

router.route("/customerbyContact/:phone").get(handleGetCustomerByContact);

router.route("/customerbyOutlet/:outlet_id").get(handleGetCustomerByOutletId);

router.route("/customerbyEmail/:email").get(handleGetCustomerByEmail);

router.route("/register").post(register);

router.route("/add-servey").post(handlePostServey);

router.route("/login").post(login);

router.route("/refresh").post(refresh);

router.route("/category/:category").get(handleGetCustomerbyCategory);
router.route("/survey/:category/:outlet_id").get(handleGetCustomerbySurvey);

router.route("/filter").post(handleGetCustomersbyFilter);

router.route("/filterSurvey/:id").post(handleGetCustomersServeybyFilter);

router.route("/authenticate/:id").patch(handleAuthentcateCustomerById);

router.route("/limit/:id").patch(handleLimitCustomerById);

router.route("/updateProfilePic/:id").put(
  upload.fields([
    { name: "customer_profile_image", maxCount: 1 },
  ]),
  handleUpdateAttributes
)

router
  .route("/:id")
  .get(handleGetCustomerById)
  .patch(handleUpdateCustomerById)
  .delete(handleDeleteCustomerById);

module.exports = router;

async function handleUpdateAttributes(req, res) {
  try {
    const profilePic =req.files && req.files["customer_profile_image"] ? req.files["customer_profile_image"][0] : null;
   

    // Use the function to update the entity with the uploaded files
    const result = await handleUpdateProfilePic(
      profilePic,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in route:", error.message);
    res.status(500).json({ error: error.message });
  }
}
