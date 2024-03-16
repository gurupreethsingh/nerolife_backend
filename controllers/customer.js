// write a controller function to get all the Customers from the database.
// for this first import the Customer class from the models file Customer.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer");
const User = require("../models/user");
const secretKey = "6gh8fhs8ij1d"; // Replace with a secure secret key in a production environment


const fs = require("fs");
(path = require("path")),
(cors = require("cors")),
(multer = require("multer"));

const DIR = "./uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const customerId = req.params.id;
    // const fileName = `${customerId}_${file.originalname.toLowerCase().split(' ').join('-')}`;
    const fileExtension = file.originalname.toLowerCase().split(".").pop();
    const fileName = `${customerId}.${fileExtension}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 100
  // },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime"];

    if (
      allowedImageTypes.includes(file.mimetype) ||
      allowedVideoTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error(
          "Only image (png, jpg, jpeg) and video (mp4, mpeg, quicktime) formats allowed!"
        )
      );
    }
  },
});


// Function to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: "15m" });
};

// function to get all the Customers.
async function handleGetAllCustomers(req, res) {
  const allDbCustomers = await Customer.find({}).sort({customer_id : -1});
  return res.json(allDbCustomers);
}

function isValidDateString(dateString) {
  const regex = /^[A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;
  return regex.test(dateString);
}


async function handleGetCustomersbyFilter(req, res) {
  const body = req.body;
  const filter = {};

  console.log("form date", body.fromDate);
  console.log("to date", body.endDate);

  // Construct filter object based on provided values
  if (body.music_preference) filter.music_preference = body.music_preference;
  if (body.event_preference) filter.event_preference = body.event_preference;
  if (body.music_platform) filter.music_platform = body.music_platform;
  if (body.outing_frequency) filter.outing_frequency = body.outing_frequency;
  if (body.communication_preference) filter.communication_preference = body.communication_preference;
  if (body.gender) filter.gender = body.gender;
  if (body.age_group) filter.age_group = body.age_group;

  if (body.fromDate && body.endDate && isValidDateString(body.fromDate) && isValidDateString(body.endDate)) {
    filter.createdAt = {
      $gte: new Date(body.fromDate), // Greater than or equal to fromDate
      $lte: new Date(body.endDate)   // Less than or equal to endDate
    };
  }

 



  const allDbCustomers = await Customer.find(filter).sort( {customer_id: -1} );;


  return res.json(allDbCustomers);
}

async function handleGetCustomersServeybyFilter(req, res) {
  const body = req.body;
  const filter = {};

  console.log("form date", body.fromDate);
  console.log("to date", body.endDate);

  console.log("id", req.params.id);
  filter.surveyed_outletId = req.params.id;

  // Construct filter object based on provided values
  if (body.music_preference) filter.music_preference = body.music_preference;
  if (body.event_preference) filter.event_preference = body.event_preference;
  if (body.music_platform) filter.music_platform = body.music_platform;
  if (body.outing_frequency) filter.outing_frequency = body.outing_frequency;
  if (body.communication_preference) filter.communication_preference = body.communication_preference;
  if (body.gender) filter.gender = body.gender;
  if (body.age_group) filter.age_group = body.age_group;

  if (body.fromDate && body.endDate && isValidDateString(body.fromDate) && isValidDateString(body.endDate)) {
    filter.createdAt = {
      $gte: new Date(body.fromDate), // Greater than or equal to fromDate
      $lte: new Date(body.endDate)   // Less than or equal to endDate
    };
  }

 



  const allDbCustomers = await Customer.find(filter).sort({ createdAt: -1 });;


  return res.json(allDbCustomers);
}

// function to get the Customer by id.
async function handleGetCustomerById(req, res) {
  // first get the id enterd by the Customer.
  const fetched_Customer = await Customer.findOne({
    customer_id: req.params.id,
  });
  // if the Customer if not found by the id.
  if (!fetched_Customer) {
    return res.status(400).json({ error: "Customer not found." });
  }
  // return the fetch Customer from the database.
  return res.json(fetched_Customer);
}

async function handleGetCustomerByContact(req, res) {
  // Attempt to find the customer by phone number
  const fetchedCustomer = await Customer.findOne({ phone: req.params.phone });

  // If the customer is not found
  if (!fetchedCustomer) {
    return res.status(404).json({ message: "Customer not found." });
  }

  // If the customer is found, return it
  return res.status(200).json(fetchedCustomer);
}

async function handleGetCustomerByEmail(req, res) {
  // first get the id enterd by the Customer.
  const fetched_Customer = await Customer.findOne({
    email: req.params.email,
  });
  // if the Customer if not found by the id.
  if (!fetched_Customer) {
    return res.status(404).json({ error: "Customer not found." });
  }
  // return the fetch Customer from the database.
  return res.json(fetched_Customer);
}

async function handleUpdateProfilePic(profilePic, body) {
  try {
    console.log("updating ...", body.id);
    console.log("body ", body);

    customer_profile_image = `http://localhost:8000/uploads/${profilePic.filename}`;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { customer_id: body.id },
      {customer_profile_image : customer_profile_image},
      { new: true, runValidators: true }
    );

    console.log("Updated Picture: ", updatedCustomer);

    if (!updatedCustomer) {
      console.log("error");
    }
    console.log("updated");
  } catch (error) {
    console.log(error);
  }
}




async function handleGetCustomerbyCategory(req, res) {
  const category = req.params.category;
  const customer_category = await Customer.aggregate([
    {
      $group: {
        _id: `$${category}`,
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);
  // if the Customer if not found by the id.
  if (!customer_category) {
    return res.status(400).json({ error: "Customer not found." });
  }
  // return the fetch Customer from the database.
  return res.json(customer_category);
}

async function handleGetCustomerbySurvey(req, res) {
  const category = req.params.category;
  const outlet_id = req.params.outlet_id; // assuming outlet_id is obtained from the request parameters

  try {
    const customer_category = await Customer.aggregate([
      {
        $match: {
          self_registered: false,
          surveyed_outletId: outlet_id
        }
      },
      {
        $group: {
          _id: `$${category}`,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);
    
    // Check if any customer categories were found
    if (customer_category.length === 0) {
      return res.status(404).json({ error: "No customers found matching the criteria." });
    }
    
    // Return the fetched customer categories
    return res.json(customer_category);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleUpdateCustomerById(req, res) {
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { customer_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    return res.json({
      status: "Customer updated successfully.",
      updatedCustomer,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleAuthentcateCustomerById(req, res) {
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { customer_id: req.params.id },
      { authentication_status: true }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    return res.json({
      status: "Customer Authenticated Successfully.",
      updatedCustomer,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleLimitCustomerById(req, res) {
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { customer_id: req.params.id },
      { authentication_status: false }, // Update authentication_status to true
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    return res.json({
      status: "Customer Limited Successfully.",
      updatedCustomer,
    });

  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleDeleteCustomerById(req, res) {
  try {
    const deletedCustomer = await Customer.findOneAndDelete({customer_id : req.params.id});

    const deletedUser = await User.findOneAndDelete({userId : req.params.id});

    if (!deletedCustomer && !deletedUser) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // const deletionTime = new Date();
    // // You can perform additional operations or logging related to the deletion here.
    // console.log(deletionTime);

    return res.json({
      status: "Customer deleted successfully.",
      deletedCustomer,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleCreateNewCustomer(req, res) {
  try {
    const body = req.body;
    console.log("body", body);
    if (
      !body.customer_first_name ||
      !body.customer_last_name ||
      !body.password ||
      !body.email ||
      !body.phone ||
      !body.dob ||
      !body.gender
    ) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }

    const existingUser = await Customer.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // now we will push the code into the mongodb database into the Customers collection.
    const result = await Customer.create({
      customer_first_name: body.customer_first_name,
      customer_last_name: body.customer_last_name,
      customer_id: body.customer_id,
      gender: body.gender, // dropdown
      dob: body.dob,
      phone: body.phone,
      email: body.email,
      password: hashedPassword,
      age_group: body.age_group, // drop down auto generation
      music_preference: body.music_preference, // dropdown
      event_preference: body.event_preference, // dropdown
      music_platform: body.music_platform, // dropdown
      outing_frequency: body.outing_frequency, // dropdown
      communication_preference: body.communication_preference, // dropdown
      social_handles: body.social_handles,
      authentication_status: body.authentication_status,
      customers_feedback: body.customers_feedback,
      request_help: body.request_help,
      invite_link: body.invite_link,
      customer_disclaimer: body.customer_disclaimer,
      customer_license_acceptance: body.customer_license_acceptance,
      attended_events: body.attended_events,
      reserved_events: body.reserved_events,
    });
    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Customer has been created.
    return res
      .status(201)
      .json({ Message: "Registration Successfull.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handleGetCustomerByOutletId(req, res) {
  const allDbCustomers = await Customer.find(

    {self_registered: false,
    surveyed_outletId: req.params.outlet_id
    }
    
    );
  return res.json(allDbCustomers);
}



async function register(req, res) {
  try {
    const body = req.body;
    console.log("body", body);
    if (
      !body.customer_first_name ||
      !body.customer_last_name ||
      !body.password ||
      !body.email ||
      !body.phone ||
      !body.dob ||
      !body.gender
    ) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }

    const existingUser = await Customer.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // now we will push the code into the mongodb database into the Customers collection.
    const result = await Customer.create({
      customer_first_name: body.customer_first_name,
      customer_last_name: body.customer_last_name,
      customer_id: body.customer_id,
      phone: body.phone,
      email: body.email,
      password: hashedPassword,
      dob: body.dob,
      gender: body.gender,
      age_group: body.age_group,
    });

    //  we will consolel the result as well .
    console.log("Result is ", result);
    // so return the status code as 201 , so as to indicate Customer has been created.
    return res
      .status(201)
      .json({ Message: "Registration Successfull.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;

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
    res.json({ accessToken });
  });
}

async function login(req, res) {
  try {
    const body = req.body;
    if (!body.email || !body.password) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }

    const user = await Customer.findOne({ email: body.email });

    if (!user || !bcrypt.compareSync(body.password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);

    // Generate refresh token (store this in a database for better security)
    const refreshToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "7d",
    });

    // Set refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // so return the status code as 201 , so as to indicate Customer has been created.
    return res.status(201).json({
      Message: "Login Success.",
      accessToken: accessToken,
      refreshtoken: refreshToken,
      customer_id: user.customer_id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

async function handlePostServey(req, res) {
  try {
    const body = req.body;
    console.log("body", body);
    if (
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.phone ||
      !body.dob ||
      !body.gender
    ) {
      // we will set the reponse code to 400
      return res.status(400).json({ Warning: "All fields are required. " });
    }

    const existingUser = await Customer.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

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

    // now we will push the code into the mongodb database into the Customers collection.
    const result2 = await Customer.create({
      customer_first_name: body.first_name,
      customer_last_name: body.last_name,
      customer_id: body.userId,
      phone: body.phone,
      email: body.email,
      password: hashedPassword,
      dob: body.dob,
      gender: body.gender,
      age_group: body.age_group,
      music_preference: body.music_preference,
      event_preference:body.event_preference,
      music_platform: body.music_platform,
      outing_frequency: body.outing_frequency,
      communication_preference: body.communication_preference,
      self_registered: false,
      surveyed_outletId: body.outlet_id,
      surveyed_outletName: body.outlet_name
    });

    //  we will consolel the result as well .
    console.log("Result is ", result2);
    // so return the status code as 201 , so as to indicate Customer has been created.
    return res
      .status(200)
      .json({ Message: "Customer Added Successfully.", id: result._id });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

module.exports = {
  handleGetAllCustomers,
  handleGetCustomerById,
  handleUpdateCustomerById,
  handleDeleteCustomerById,
  handleCreateNewCustomer,
  register,
  login,
  refresh,
  handleGetCustomerbyCategory,
  handleGetCustomersbyFilter,
  handleAuthentcateCustomerById,
  handlePostServey,
  handleGetCustomerbySurvey,
  handleGetCustomerByContact,
  handleGetCustomerByEmail,
  handleGetCustomerByOutletId,
  handleLimitCustomerById,
  handleUpdateProfilePic,
  upload,
  handleGetCustomersServeybyFilter
};
