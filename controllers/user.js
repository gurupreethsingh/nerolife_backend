// write a controller function to get all the users from the database.
// for this first import the User class from the models file user.js

const User = require("../models/user");
// import mongoose database.
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

const Customer = require("../models/customer");
const Outlet = require("../models/outlet");
const Artist = require("../models/artist");
const Event = require("../models/events");

const secretKey = "6gh8fhs8ij1d"; // Replace with a secure secret key in a production environment


// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

const sendOTP = async (req, res) => {
  let email = req.body.email;
  console.log("email", email);
  // Create a Nodemailer transporter using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // You can change the service as per your email provider
    auth: {
      user: 'nerolifeexclusivenetworks@gmail.com', // Your email address
      pass: 'yfbs bkdc mxqh wfvy', // Your email password or application-specific password

      // ""
    },
  });

  // Generate OTP
  const otp = generateOTP();

  // Email body
  let mailOptions = {
    from: 'nerolifeexclusivenetworks@gmail.com', // Your email address
    to: email, // Recipient's email address
    subject: 'Your OTP',
    text: `Welcome to The World of NEROLIFE

    THOUGHTS. APPLIED.
    
    Your OTP is ${otp}

    This OTP is Valid Till Next 2 Minutes

    Kindly Do Not Share This OTP With Anyone.
    
   
    
    Thanks & Regards
     
    NEROLIFE NETWORKS PVT. LTD.
    
    An ORIGINAL NEROLIFE NETWORKS PRODUCTION 
    
    POWERED BY © NIGHTCUBE SYSTEMS
    
    All Right Reserved. Copyright 2024 © NEROLIFE NETWORKS PVT. LTD. ®
    
    `
  };

  try {
    // Send mail with defined transport object

    
    const fetched_user = await User.findOne({ email: email });

    await transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Message sent: %s', info.messageId);
      return res.status(200).json(otp) ;
      // Handle success if needed
    })
    .catch(error => {
      console.error('Error sending email:', error);
      return res.status(500).json({message: "Network Error"}) ;
    });



   
  } catch (error) {
    console.log(error)
    return res.status(500).json({error: 'Error occurred while sending email:'});
  }
};

const sendWelcomeMessage = async (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  console.log("email", email);
  // Create a Nodemailer transporter using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // You can change the service as per your email provider
    auth: {
      user: 'nerolifeexclusivenetworks@gmail.com', // Your email address
      pass: 'yfbs bkdc mxqh wfvy', // Your email password or application-specific password
    },
  });

  

  // Email body
  let mailOptions = {
    from: 'nerolifeexclusivenetworks@gmail.com', // Your email address
    to: email, // Recipient's email address
    subject: 'Welcome To NEROLIFE : Thoughts Applied !',
    text: `Dear ${name},
    A warm Welcome to NEROLIFE! 
    
    We're thrilled to have you on board and look forward to provide you on with Unique Nightlife Experiences as Per Your Music Interests. 
    
    Your presence adds tremendous value to our ever growing community. 
    
    Should you have any questions or need assistance, our team is here for you. 
    
    You can reach us by clicking on ASK FOR HELP / PROVIDE FEEDBACK from Your Settings and Alternatively You May Reach Us By Sending Email 
    
    ID : nerolifeexclusivenetworks@gmail.com
    
    Here's to our fruitful relationship !
    
    Best Regards,
    Subhadeep Banerjee
    CEO & MD
    NEROLIFE NETWORKS PVT. LTD.
    NEROLIFE GROUP
    
    `
  };

  try {
    await transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Message sent: %s', info.messageId);
      return res.status(200).json("Registered Successfully") ;
      // Handle success if needed
    })
    .catch(error => {
      console.error('Error sending email:', error);
      return res.status(500).json({message: "Network Error"}) ;
    });
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({error: 'Error occurred while sending email:'});
  }
};

const sendReservationMessage = async (req, res) => {
  let email = req.body.email;
  let outlet_email = req.body.outlet_email;
  let customer_name = req.body.customer_name;
  let outlet_name = req.body.outlet_name;
  let event_name = req.body.event_name;
  let start_date = req.body.start_date;
  let start_time = req.body.start_time;
  let reservation_category = req.body.reservation_category;
  let total_members = req.body.total_members;

  console.log("email", outlet_email);
  // Create a Nodemailer transporter using SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // You can change the service as per your email provider
    auth: {
      user: 'nerolifeexclusivenetworks@gmail.com', // Your email address
      pass: 'yfbs bkdc mxqh wfvy', // Your email password or application-specific password
    },
  });

  

  // Email body
  let mailOptions = {
    from: 'nerolifeexclusivenetworks@gmail.com', // Your email address
    to: email, // Recipient's email address
    subject: `Reservation Confirmation for ${customer_name} in ${outlet_name} for ${event_name}`,
    text: `
    Dear ${customer_name},
    
    We're delighted to confirm your reservation for ${total_members} at ${outlet_name} for ${event_name}. 
    
    ${reservation_category}
    
    ${start_date}
    
    ${start_time}
    
    We look forward to have you for a Wonderful Experience!
    
    1. Rights To Admission Reserved
    2. Cover Charges Applicable at Gate Post Reservation Timeline, Cover Charges Redeemable Inside
    3. 21+ Strictly / Carry Physical ID
    4. Club Rules Applied
    
    Thanks & Regards,
    NEROLIFE NETWORKS
    `
  };

 

  try {
    await transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Message sent: %s', info.messageId);







      return res.status(200).json("Registered Successfully") ;
      // Handle success if needed
    })
    .catch(error => {
      console.error('Error sending email:', error);
      return res.status(500).json({message: "Network Error"}) ;
    });
   
  } catch (error) {
    console.log(error)
    return res.status(500).json({error: 'Error occurred while sending email:'});
  }
};


// Function to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: "15m" });
};

// function to get all the users.
async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function handleGetAllAdmins(req, res) {
  try {
    const admins = await User.find({
      role: { $in: ["superadmin", "admin1", "admin2"] }
    });
    return res.json(admins);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}


// function to get the user by id.
async function handleGetUserById(req, res) {
  // first get the id enterd by the user.
  const fetched_user = await User.findOne({ userId: req.params.id });
  // if the user if not found by the id.
  if (!fetched_user) {
    return res.status(400).json({ error: "User not found." });
  }
  // return the fetch user from the database.
  return res.json(fetched_user);
}

async function handleUpdatePasswordById(req, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      {userId: req.params.id},
      {password : await bcrypt.hash(req.body.password, 10)},
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ status: "Password updated successfully.", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleUpdatePasswordByEmail(req, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      {email: req.params.email},
      {password : await bcrypt.hash(req.body.password, 10)},
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ status: "Password updated successfully.", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleUpdateUserById(req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // Use req.body to get the updated values from Postman or frontend
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ status: "User updated successfully.", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleDeleteUserById(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const deletionTime = new Date();
    // You can perform additional operations or logging related to the deletion here.
    console.log(deletionTime);

    return res.json({
      status: "User deleted successfully.",
      deletedUser,
      deletionTime,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleCreateNewUser(req, res) {
  try {
    const body = req.body;
    console.log("body : ", body);
    const result = await User.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      gender: body.gender,
      job_title: body.job_title,
    });
    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate user has been created.
    return res
      .status(201)
      .json({ Message: "User successfully created.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function countDocuments(req, res) {
  try {
    const userCount = await User.countDocuments({});
    const customerCount = await Customer.countDocuments({});
    const artistCount = await Artist.countDocuments({});
    const outletCount = await Outlet.countDocuments({});
    const eventCount = await Event.countDocuments({});

    res.json({
      users: userCount,
      customers: customerCount,
      artists: artistCount,
      outlets: outletCount,
      events: eventCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function register(req, res) {
  try {
    const body = req.body;
    console.log("body", body);
    if (
      !body.first_name ||
      !body.password ||
      !body.userId ||
      !body.email ||
      !body.phone
    ) {
      // we will set the reponse code to 400
      return res.status(400).json({ message: "All fields are required. " });
    }

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const existingUser2 = await User.findOne({ phone: body.phone });
    if (existingUser2) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // now we will push the code into the mongodb database into the Customers collection.

    if (body.role === "user") {
      await Customer.create({
        customer_first_name: body.first_name,
        customer_last_name: body.last_name,
        customer_id: body.userId,
        phone: body.phone,
        email: body.email,
        password: hashedPassword,
        dob: body.dob,
        gender: body.gender,
        age_group: body.age_group,
        music_preference: "BOLLYWOOD",
        event_preference: "LADIES NIGHT",
        music_platform: "APPLE ITUNES",
        outing_frequency: "ONCE EVERY WEEK",
        communication_preference: "EMAIL",
        authentication_status: false,
        self_registered: true,
        membership_plan : "Normal"
        
      });
    } else if (body.role === "outlet") {
      await Outlet.create({
        outlet_name: body.first_name,
        outlet_id: body.userId,
        phone: body.phone,
        email: body.email,
        password: hashedPassword,
        outlet_category: "NIGHTCLUB",
        closing_time: "01:00 AM",
        opening_time: "12:00 PM",
        address: "sample address",
        website: "https://nerolife.in",
        outlet_icon:
          "http://localhost:8000/uploads/outlet_default/outlet_default_icon.jpg",
        intro_video:
          "http://localhost:8000/uploads/outlet_default/outlet_default_video.mp4",
        outlet_profile_rules_and_regulation:
          "1. Rights To Admission Reserved\n2. Cover Charges Applicable at Gate Post 8 PM\n3. 21+ /Physical ID Mandatory\n4. Club Rules Applied\n5. Cover Charges Redeemable Inside",
      });
    } else {
      await Artist.create({
        first_name: body.first_name,
        last_name: body.last_name,
        artist_id: body.userId,
        dob: body.dob,
        phone: body.phone,
        email: body.email,
        password: hashedPassword,
        gender: body.gender,
        artist_stage_name: body.first_name + body.last_name,
        artist_category: "ELECTRONIC MUSICIAN & PRODUCER",
        music_operations: "BOLLYWOOD",
        artist_profile_icon:
          "http://localhost:8000/uploads/artist_default/artist_default_icon.jpg",
        artist_intro_video:
          "http://localhost:8000/uploads/artist_default/artist_default_background.mp4",
      });
    }

    const result = await User.create({
      first_name: body.first_name,
      last_name: body.last_name,
      userId: body.userId,
      phone: body.phone,
      email: body.email,
      password: hashedPassword,
      dob: body.dob,
      gender: body.gender,
      role: body.role,
    });

    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Customer has been created.
    const accessToken = generateAccessToken(body.userId);

    // Generate refresh token (store this in a database for better security)
    const refreshToken = jwt.sign({ userId: body.userId }, secretKey, {
      expiresIn: "7d",
    });

    // Set refresh token in an HTTP-only cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost",
      path: "/",
    });

    return res.status(201).json({
      message: "Register Success.",
      accessToken: accessToken,
      refreshToken: refreshToken,
      customer_id: body.userId,
      userName: body.first_name + " " + body.last_name,
      email: body.email,
      role: body.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

function refresh(req, res) {
  const refreshToken = req.headers.authorization.split(" ")[1];

  console.log("refresh token : ", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Create and send a new access token
    const accessToken = jwt.sign({ userId: decoded.userId }, secretKey, {
      expiresIn: "15m",
    });

    const role = decoded.role;
    res.json({ accessToken, role });
  });
}

async function login(req, res) {
  try {
    const body = req.body;
    if (!body.email || !body.password) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }

    const user = await User.findOne({ email: body.email });

    if (!user || !bcrypt.compareSync(body.password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.userId);

    // Generate refresh token (store this in a database for better security)
    const refreshToken = jwt.sign({ userId: user.userId, role: user.role }, secretKey, {
      expiresIn: "7d",
    });

    // Set refresh token in an HTTP-only cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost",
      path: "/",
    });

    // so return the status code as 201 , so as to indicate Customer has been created.
    return res.status(201).json({
      Message: "Login Success.",
      accessToken: accessToken,
      refreshToken: refreshToken,
      customer_id: user.userId,
      userName: user.first_name.trim() + " " + user.last_name,
      role: user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetUserByEmail(req, res) {
  // first get the id enterd by the Outlet.
  const fetched_User = await User.findOne({
    email: req.params.email,
  });
  // if the Outlet if not found by the id.
  if (!fetched_User) {
    return res.status(400).json({ error: "User not found." });
  }
  // return the fetch Outlet from the database.
  return res.json(fetched_User);
}

async function handleGetUserByContact(req, res) {
  // first get the id enterd by the Outlet.
  const fetched_User = await User.findOne({
    phone: req.params.phone,
  });
  // if the Outlet if not found by the id.
  if (!fetched_User) {
    return res.status(400).json({ error: "User not found." });
  }
  // return the fetch Outlet from the database.
  return res.json(fetched_User);
}

async function handleAdmin(req, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      {email : req.params.email},
      {role : req.params.role},
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({message: "User updated successfully.", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleUpdatePasswordById,
  handleDeleteUserById,
  handleCreateNewUser,
  register,
  refresh,
  login,
  countDocuments,
  handleGetAllAdmins,
  sendOTP,
  handleUpdatePasswordByEmail,
  handleGetUserByEmail,
  handleGetUserByContact,
  handleAdmin,
  sendWelcomeMessage,
  sendReservationMessage
};
