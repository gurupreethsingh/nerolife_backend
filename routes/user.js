const express = require("express");
const {
  handleGetAllUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleCreateNewUser,
  register, 
  refresh,
  login,
  countDocuments,
  handleGetAllAdmins,
  sendOTP,
  handleUpdatePasswordById,
  handleUpdatePasswordByEmail,
  handleGetUserByEmail,
  handleGetUserByContact,
  handleAdmin,
  sendWelcomeMessage,
  sendReservationMessage
} = require("../controllers/user");

const router = express.Router();

router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

router.route("/admins").get(handleGetAllAdmins);

router.route("/sendOtp").post(sendOTP);

router.route("/sendWelcomeMessage").post(sendWelcomeMessage);

router.route("/sendReservationMessage").post(sendReservationMessage);

router.route("/password/:id").patch(handleUpdatePasswordById);

router.route("/passwordbyEmail/:email").patch(handleUpdatePasswordByEmail);

router.route("/email/:email").get(handleGetUserByEmail);

router.route("/admin/:email/:role").patch(handleAdmin);

router.route("/phone/:phone").get(handleGetUserByContact);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/countDocuments").get(countDocuments);

router
  .route("/:id")
  .get(handleGetUserById)
  .delete(handleDeleteUserById);

module.exports = router;
