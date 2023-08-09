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
    countersCollection = db.collection("counter")
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

// start
app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to Travel server" });
});

// Register
app.post("/register", async (req, res) => {
  try {
    const registerDetails = req.body;
    const { username, name, password, gender } = registerDetails;

    const checkUser = await userCollection.findOne({ username: username });
    if (checkUser) {
      res.status(400).json({ error: "User Already Exists" });
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password is too short" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 5);

      await countersCollection.updateOne({},{$inc: {seq: 1}});
      const counter = await countersCollection.findOne({}, {_id: 0});
      const userId = counter.seq;

      await userCollection.insertOne({
        username: username,
        name: name,
        password: hashedPassword,
        gender: gender,
        userId: userId,
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

module.exports = app;
