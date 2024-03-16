// write a controller function to get all the Outlets from the database.
// for this first import the Outlet class from the models file Outlet.js

const Document = require("../models/documentcount");
const express = require("express");
const router = express.Router();
const fs = require("fs");
(path = require("path")),
  (cors = require("cors")),
  (multer = require("multer"));





async function handleGetAllDocuments(req, res){
    const allDocuments = await Document.findOne();
    return res.json(allDocuments);
}

async function handlePostDocuments(req, res) {
    try {
  
      const updatedDocument = await Document.create({
        totalCustomers: 0,
        totalArtists: 0,
        totalEvents: 0,
        totalOutlets: 0,
        totalTransactions: 0,
      })
  
      return updatedDocument;
    } catch (error) {
      console.error("Error incrementing category:", error);
      throw error;
    }
  }


  async function incrementCategory(req, res) {
    try {
      category = req.params.category;
      console.log("category", category);
      const updateQuery = { $inc: {} };
      updateQuery.$inc[category] = 1;
  
      const updatedDocument = await Document.findOneAndUpdate({}, updateQuery, { new: true });
  
      return res.status(200).json({message : "Added Successfully"});
    } catch (error) {
      console.error("Error incrementing category:", error);
      return res.status(500).json({message : "Internal Server Error"});
    }
  }
  


  







module.exports = {
    handleGetAllDocuments,
    incrementCategory,
    handlePostDocuments
};

