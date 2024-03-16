// import mongoose database.
const mongoose = require("mongoose");

//make the user Schema
const posSchema = new mongoose.Schema(
  {
    transaction_id : {type : String },
    customer_id : {type : String }, 
    customer_name : {type : String },
    phone: { type: String  },
    outlet_id : {type : String }, 
    outlet_name: { type: String },
    validity: { type: Boolean },
    gross_amount : {type:Number}, // event location --- outlet google location
    eligibility : {type : Boolean},
    total_amount : {type:Number}, 
    coupon : { type: String },
    final_amount : {type:Number}, 
    status : {type : String},
  },
  {
    timestamps: true,
  }
);

// make the User module for exporting.
const Pos = mongoose.model("pos", posSchema);

// export this User class created.
module.exports = Pos;