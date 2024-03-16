// write a controller function to get all the Outlets from the database.
// for this first import the Outlet class from the models file Outlet.js

const Rating = require("../models/ratings");

const Outlet = require("../models/outlet");
const Artist = require("../models/artist");

const express = require("express");

(path = require("path")),
(cors = require("cors")),
(multer = require("multer"));

async function handleGetAllRatings(req, res) {
    const allRatings = await Rating.find({});
    return res.json(allRatings);
}

async function handlePostRatings(req, res) {
    try {
      // Update the Outlet's outlet icon and intro video paths with the new file names
      let body = req.body;
      let category = req.params.category;

      const ratings = JSON.parse(body.ratings);

      let totalRating = 0;

      let average = 0;
      
      ratings.forEach(ratingItem => {
        totalRating += ratingItem.rating;
      });

      if(category === 'outlet'){
        average = totalRating/3;
      }else if (category === 'artist'){
        average = totalRating/2;
      }

      const result = await Rating.create({
        from_id: body.from_id,
        to_id: body.to_id,
        ratings: ratings,
        average    
      });

    const rating2 = await Rating.find({ to_id: body.to_id });

    let totalAverage = 0;

    rating2.forEach(rating => {
      totalAverage += rating.average;
  });

  console.log("totalAverage", totalAverage)

  // Calculate overall average
  const overallAverage = totalAverage / rating2.length;

  if(category === 'outlet'){
    const outlet = await Outlet.findOneAndUpdate(
      { outlet_id: body.to_id},
      { rating: overallAverage }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
  }else if(category === 'artist'){
    const artist = await Artist.findOneAndUpdate(
      { artist_id: body.to_id},
      { rating: overallAverage }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
  }



      console.log("average Rating", overallAverage);
      return res.status(200).json({
        message: "Rating Added Successfully",
      });
    } catch (error) {
      console.error("Error Adding Event:", error.message);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  async function handleCheckReview(req, res) {
  try {
        const reviewed = await Rating.findOne({ from_id: req.params.fromId, to_id:  req.params.toId });
        
        if (reviewed) {
            return res.status(200).json({ message: "Rating Found", reviewed });
        } else {
            return res.status(404).json({ message: "Rating Not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error2" });
    }
}


module.exports = {
    handleGetAllRatings,
    handlePostRatings,
    handleCheckReview
};
