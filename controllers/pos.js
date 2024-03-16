// write a controller function to get all the Outlets from the database.
// for this first import the Outlet class from the models file Outlet.js

const Pos = require("../models/pos");
const express = require("express");

(path = require("path")),
(cors = require("cors")),
(multer = require("multer"));

async function handleGetAllPos(req, res) {
    const allPos = await Pos.find({});
    return res.json(allPos);
}

async function handleGetPosbyOutlet(req, res) {
  const allPos = await Pos.find({outlet_id : req.params.outlet_id});
  return res.json(allPos);
}

async function handleGetPosbyTransactionId(req, res) {
  const allPos = await Pos.findOne({transaction_id : req.params.transaction_id});
  return res.json(allPos);
}

async function handlePostPos(req, res) {
    try {
      const body = req.body;
      console.log("body", body);
      const result = await Pos.create({
        transaction_id: body.transaction_id,
        customer_id: body.customer_id,
        customer_name: body.customer_name,
        phone: body.phone,
        outlet_id: body.outlet_id,
        outlet_name: body.outlet_name,
        validity: body.validity,
        gross_amount: body.gross_amount,
        eligibility: body.eligibility,
        total_amount: body.total_amount,
        coupon : body.coupon,
        final_amount : body.final_amount,
        status : body.status,
      });
  
      //  we will consolel the result as well .
      console.log("Result is ", result);
      // so return the status code as 201 , so as to indicate Customer has been created.
      return res
        .status(200)
        .json({ Message: "Pos Added Successfully.", id: result._id });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
}

async function handleUpdatePos(req, res) {
  try {
    console.log("body", req.body);
    const updatedCustomer = await Pos.findOneAndUpdate(
      { transaction_id: req.params.transaction_id },
      { 
        gross_amount:req.body.gross_amount,
        eligibility: req.body.eligibility,
        total_amount: req.body.total_amount,
        coupon : req.body.coupon,
        final_amount : req.body.final_amount,
        status : req.body.status,
      
      }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    return res.json({
      status: "Pos Authenticated Successfully.",
      updatedCustomer,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}




module.exports = {
    handleGetAllPos,
    handlePostPos,
    handleGetPosbyOutlet,
    handleGetPosbyTransactionId,
    handleUpdatePos
};
