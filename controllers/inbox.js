// write a controller function to get all the Outlets from the database.
// for this first import the Outlet class from the models file Outlet.js

const Inbox = require("../models/inbox");
const express = require("express");

(path = require("path")),
(cors = require("cors")),
(multer = require("multer"));

async function handleGetAllMessages(req, res) {
    const allMessages = await Inbox.find({}).sort({_id : -1});
    return res.json(allMessages);
}

async function handleGetInbox(req, res) {
    const inboxMessages = await Inbox.find({archieved: false}).sort({_id : -1});
    return res.json(inboxMessages);
}


async function handlePostNewMessage(req, res) {
    try {
      const body = req.body;
      console.log("body", body);
      const result = await Inbox.create({

        message_receivers: JSON.parse(body.message_receivers),
        subject: body.subject,
        message: body.message,
        archieved: false,
        category: body.category,
      });
  
      //  we will consolel the result as well .
      console.log("Result is ", result);
      // so return the status code as 201 , so as to indicate Customer has been created.
      return res
        .status(200)
        .json({ Message: "Message Added Successfully.", id: result._id });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
}

async function handleDeleteMessageById(req, res) {
    try {
      const deletedMessage = await Inbox.findByIdAndDelete(req.params.id);
  
      return res.json({
        status: "Message deleted successfully.",
        deletedMessage,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }

  async function handleArchiveMessageById(req, res) {
    try {
      const archiveMessage = await Inbox.findByIdAndUpdate(
        req.params.id ,
        { archieved: true }, // Update authentication_status to true
        { new: true, runValidators: true }
      );
     
  
      return res.json({
        status: "Message Archived Successfully.",
        archiveMessage,
      });
  
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }






module.exports = {
    handleGetAllMessages,
    handlePostNewMessage,
    handleDeleteMessageById,
    handleArchiveMessageById,
    handleGetInbox

};
