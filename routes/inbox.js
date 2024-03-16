const express = require("express");
const {
    handleGetAllMessages,
    handlePostNewMessage,
    handleDeleteMessageById,
    handleArchiveMessageById,
    handleGetInbox
} = require("../controllers/inbox");

const router = express.Router();
router.route("/").get(handleGetAllMessages).post(handlePostNewMessage);

router.route("/unArchived").get(handleGetInbox);

router.route("/archive/:id").patch(handleArchiveMessageById);

router.route("/delete/:id").delete(handleDeleteMessageById);

module.exports = router;