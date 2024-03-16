// importing the express package in our file.
const express = require("express");
// connect to mongo db using the function connectMongoDb
const { connectMongoDb } = require("./connection");

const cookieParser = require("cookie-parser");
// import the fs function to log the data.
const { logReqRes } = require("./middlewares"); // here no need to write index.js , it automatically means pick from index .js file
// import the userRouter from the userRouter.js file.
const userRouter = require("./routes/user");

const cors = require("cors");

const customerRouter = require("./routes/customer");
const artistRouter = require("./routes/artist");
const eventRouter = require("./routes/events");
const outletRouter = require("./routes/outlet");
const calendarRouter = require("./routes/calendar");
const linkageRouter = require("./routes/artistoutletsync");
const reservationRouter = require("./routes/reservation");
const posRouter = require("./routes/pos");
const roasRouter = require("./routes/roas");
const inboxRouter = require("./routes/inbox");
const ratingRouter = require("./routes/ratings");
const storiesRouter = require("./routes/stories");
const documentRouter = require("./routes/documentcount");
const adminAndofficialRouter = require("./routes/adminandofficial");

const imageRouter = require("./controllers/images");
const videoRouter = require("./controllers/videos");

// creating your app.
const app = express();
// create a port for our application.

app.use(express.json());

// Enable CORS with specific origin
app.use(
  cors({
    origin: "http://localhost:3000", // Update with your frontend URL
    credentials: true,
  })
);

// Middleware to parse cookies
app.use(cookieParser());

const PORT = 8000;

// const username = 'nerolife';
// const password = '';
// const host = '142.93.222.247';
// const port = '33372';
// const database = 'nerolife';

// // Construct the MongoDB URI with username and password
// const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;

// Call the function with the constructed MongoDB URI
// connectMongoDb(uri);

// connect to our mongo db database.
connectMongoDb("mongodb://127.0.0.1:27017/nerolifedb");
// connectMongoDb(uri);
//https://142.93.222.247:33372/nerolifedb
// this is to parse the entire body of the json, while taking from the front end.form
app.use(express.urlencoded({ extended: false }));
// here use the function to log the req and response..into a text file calling the file as log.txt file.
// app.use(logReqRes("log.txt"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Update with your frontend's URL
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes for the user has to be defined here.
app.use("/api/user", userRouter);
app.use("/api/customers", customerRouter);
app.use("/api/artists", artistRouter);
app.use("/api/events", eventRouter);
app.use("/api/outlets", outletRouter);
app.use("/api/calendars", calendarRouter);
app.use("/api/images", imageRouter);
app.use("/api/videos", videoRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/inbox", inboxRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/stories", storiesRouter);
app.use("/api/documents", documentRouter);
app.use("/api/adminandofficials", adminAndofficialRouter);

app.use("/api/artistoutletsync", linkageRouter);

app.use("/api/pos", posRouter);
app.use("/api/roas", roasRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// tell the server to listten to the given port number to start the server. and console the log for successful connection.
app.listen(PORT, () =>
  console.log(`Server successfully at port number ${PORT}`)
);
