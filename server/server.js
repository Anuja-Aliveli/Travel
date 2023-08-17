require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let db = null;
let userCollection = null;
let countersCollection = null;
let packagesCollection = null;
let reviewsCollection = null;
let feedbackCollection = null;
let bookingsCollection = null;

const initializeAndConnect = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(MONGODB_URI, dbOptions);
    db = mongoose.connection;
    userCollection = db.collection("user");
    countersCollection = db.collection("counter");
    packagesCollection = db.collection("packages");
    reviewsCollection = db.collection("reviews");
    feedbackCollection = db.collection("feedback");
    bookingsCollection = db.collection("bookings");
    if (db.readyState === 1) {
      console.log("Mongoose Connected");
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
      });
    } else {
      console.log("MongoDB connection failed or pending.");
    }
  } catch (err) {
    console.log(`Db err ${err}`);
    process.exit(1);
  }
};

app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ error: "Internal server error" });
});
initializeAndConnect();

// Register
app.post("/register", async (req, res) => {
  try {
    const registerDetails = req.body;
    const {
      username,
      name,
      password,
      gender,
      question,
      answer,
    } = registerDetails;

    const checkUser = await userCollection.findOne({ username: username });
    if (checkUser !== null) {
      res.status(400).json({ error: "User Already Exists" });
    } else if (password.length < 6) {
      res.status(400).json({ error: "Password is too short" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 5);

      await countersCollection.updateOne({}, { $inc: { seq: 1 } });
      const counter = await countersCollection.findOne({}, { _id: 0 });
      const userId = counter.seq;

      await userCollection.insertOne({
        username: username,
        name: name,
        password: hashedPassword,
        gender: gender,
        userId: userId,
        question: question,
        answer: answer,
      });

      res.status(200).json({ message: "Successfully Registered" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server error", errMsg: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const loginDetails = req.body;
  const { username, password } = loginDetails;
  const checkUser = await userCollection.findOne({ username: username });
  if (!checkUser) {
    res.status(400).json({ message: "Invalid User" });
  } else {
    const isPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (isPasswordMatch) {
      const payload = {
        username: username,
      };
      const jwtToken = jwt.sign(payload, "MY_TOKEN");
      res.status(200).json({ jwtToken: jwtToken });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  }
});

// Question
app.get("/forgot/question", async (req, res) => {
  try {
    const { username } = req.query;
    const userDetails = await userCollection.findOne(
      { username: username },
      { projection: { username: 1, question: 1, answer: 1 } }
    );
    if (userDetails !== null) {
      res
        .status(200)
        .json({ question: userDetails.question, answer: userDetails.answer });
    } else {
      res.status(400).json({ error: "User Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", errorMsg: error.message });
  }
});

// Reset
app.put("/forgot/reset", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    const userDetails = await userCollection.updateOne(
      { username: username },
      { $set: { password: hashedPassword } }
    );
    if (userDetails.modifiedCount > 0) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ error: "Password update failed" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", errorMsg: error.message });
  }
});

// travel
app.get("/", async (req, res) => {
  res.status(200).json({ message: "welcome to the server" });
});

// middleware
const verifyToken = (req, res, next) => {
  let jwtToken = null;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    res.status(401).json({ error: "Invalid JWT Token" });
  } else {
    jwt.verify(jwtToken, "MY_TOKEN", async (error, payload) => {
      if (error) {
        res.status(401).json({ error: "Invalid JWT Token" });
      } else {
        req.username = payload.username;
        next();
      }
    });
  }
};

// Home
app.get("/home", verifyToken, async (req, res) => {
  try {
    const packages = await packagesCollection
      .aggregate([
        {
          $match: { id: { $in: [11, 1, 17, 8, 18, 9] } },
        },
        {
          $project: {
            _id: 0,
            bio: 1,
            location: 1,
            id: 1,
            image: { $arrayElemAt: ["$images", 0] },
          },
        },
      ])
      .toArray();

    const gallery = await reviewsCollection
      .find({ gal_id: { $exists: true } }, { projection: { _id: 0 } })
      .toArray();

    const reviews = await reviewsCollection
      .find({ review_id: { $in: [1, 2, 3, 4] } }, { projection: { _id: 0 } })
      .toArray();
    res
      .status(200)
      .json({ destinations: packages, gallery: gallery, reviews: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server problem", errorMsg: error.message });
  }
});

// Package list
app.get("/packages", verifyToken, async (req, res) => {
  try {
    const nationalIds = Array.from({ length: 12 }, (_, i) => i + 1);
    const internationalIds = Array.from({ length: 12 }, (_, i) => i + 13);
    const national = await packagesCollection
      .aggregate([
        {
          $match: { id: { $in: nationalIds } },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            bio: 1,
            location: 1,
            image: { $arrayElemAt: ["$images", 0] },
          },
        },
      ])
      .toArray();
    const international = await packagesCollection
      .aggregate([
        {
          $match: { id: { $in: internationalIds } },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            bio: 1,
            location: 1,
            image: { $arrayElemAt: ["$images", 0] },
          },
        },
      ])
      .toArray();
    res.status(200).json({ national, international });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", errMsg: err.message });
  }
});

// package item
app.get("/packages/:id", verifyToken, async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const username = req.username;

    const packageDetails = await packagesCollection.findOne(
      { id: id },
      { projection: { _id: 0, bio: 0 } }
    );

    let reviews = await feedbackCollection
      .find({ packageId: id }, { projection: { _id: 0 } })
      .toArray();

    res.status(200).json({ packageDetails: packageDetails, reviews: reviews });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", errorMsg: err.message });
  }
});

// feedback
app.post("/packages/:id/feedback/", verifyToken, async (req, res) => {
  try {
    let { id } = req.params;
    const username = req.username;
    const { rating, review } = req.body;
    const userIdObj = await userCollection.findOne(
      { username: username },
      { projection: { _id: 0, userId: 1 } }
    );
    const userId = userIdObj.userId;
    await feedbackCollection.insertOne({
      userId,
      rating,
      review,
      packageId: parseInt(id),
    });
    res.status(200).json({ message: "Inserted Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server problem", errorMsg: err.message });
  }
});

// book package
app.post("/bookings", verifyToken, async (req, res) => {
  try {
    const bookingDetails = req.body;
    const username = req.username;

    const userIdObj = await userCollection.findOne(
      { username: username },
      { projection: { _id: 0, userId: 1 } }
    );
    const userId = userIdObj.userId;

    await bookingsCollection.insertOne({ ...bookingDetails, username, userId });
    res.status(200).json({ message: "Tour Booked" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server problem", errorMsg: err.message });
  }
});

// bookings
app.get("/bookings", verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const userIdObj = await userCollection.findOne(
      { username: username },
      { projection: { _id: 0, userId: 1 } }
    );
    const userId = userIdObj.userId;
    const bookings = await bookingsCollection
      .find({ userId: userId }, { projection: { _id: 0, userId: 0 } })
      .toArray();
    res.status(200).json({ bookings: bookings });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server problem", errorMsg: err.message });
  }
});
module.exports = app;
