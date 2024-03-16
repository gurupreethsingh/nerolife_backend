const Adminaandofficial = require("../models/adminandofficials");
const express = require("express");
const router = express.Router();
const fs = require("fs");
(path = require("path")),
(cors = require("cors")),
(multer = require("multer"));

async function handleGetAllAdminsAndOfficial(req, res){
    const allAdminsAndOfficial = await Adminaandofficial.find({});
    return res.json(allAdminsAndOfficial);
}

// async function handlePostStories(picture, body, res) {
//     const result = await Stories.create({ 
//         image_url: `http://localhost:8000/uploads/${picture.filename}`, 
//         message: body.message,
//     });

//     return res.status(200).json({message: "Stories Added Succesfully"})

// }
  







module.exports = {
    handleGetAllAdminsAndOfficial
};

