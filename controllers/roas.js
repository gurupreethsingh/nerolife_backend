// write a controller function to get all the Outlets from the database.
// for this first import the Outlet class from the models file Outlet.js

const Roas = require("../models/roas");
const express = require("express");

(path = require("path")),
(cors = require("cors")),
(multer = require("multer"));

async function handleGetAllRoas(req, res) {
    const allRoas = await Roas.find({});
    return res.json(allRoas);
}

async function handleGetRoasbyType(req, res) {
  const allRoas = await Roas.find({type : req.params.type});
  return res.json(allRoas);
}

async function handlePostRoas(req, res) {
    try {
      const body = req.body;
      console.log("body", body);
      const result = await Roas.create({
        name: body.name,
        type: body.type,
        link: body.link,
        ctr: body.ctr,
        budget: body.budget,
      });
  
      //  we will consolel the result as well .
      console.log("Result is ", result);
      // so return the status code as 201 , so as to indicate Customer has been created.
      return res
        .status(200)
        .json({ Message: "Roas Added Successfully.", id: result._id });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
}



async function handleUpdateRoas(req, res) {
  try {
    console.log("body", req.body);
    const updatedRoas = await Roas.findByIdAndUpdate(
      req.params.id ,
      { 
        name: req.body.name,
        type:req.body.type,
        link: req.body.link,
        ctr: req.body.ctr,
        budget : req.body.budget,
      
      }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!updatedRoas) {
      return res.status(404).json({ error: "Roas not found." });
    }

    return res.json({
      status: "Roas Updated Successfully.",
      updatedRoas,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleUpdateLinks(req, res) {
  try {
    
    const updatedRoas = await Roas.findByIdAndUpdate(
      req.params.id,
      { 
        link: req.body.link,
      },
      { new: true, runValidators: true }
    );
    if (!updatedRoas) {
      return res.status(404).json({ error: "Roas not found." });
    }

    return res.json({
      status: "Roas Link Updated Successfully.",
      updatedRoas,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleUpdateCTR(req, res) {
  try {
    
    const updatedRoas = await Roas.findByIdAndUpdate(
      req.params.id,
      { 
        link: req.body.link,
      },
      { new: true, runValidators: true }
    );
    if (!updatedRoas) {
      return res.status(404).json({ error: "Roas not found." });
    }

    return res.json({
      status: "Roas Link Updated Successfully.",
      updatedRoas,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}




module.exports = {
    handleGetAllRoas,
    handleGetRoasbyType,
    handleUpdateRoas,
    handlePostRoas,
    handleUpdateLinks
};
