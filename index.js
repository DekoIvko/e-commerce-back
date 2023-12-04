const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

// mongodb connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to mongoose Database"))
  .catch((err) => console.log(err));

// schema user
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  image: String,
});

// model user
const userModel = mongoose.model("user", userSchema);

// api signup
app.post("/singup", async (req, res) => {
  try {
    const { email } = req.body;
    userModel
      .findOne({ email: email })
      .then((data) => {
        if (data) {
          res.send({ message: "Email already exist" });
        } else {
          const userData = userModel(req.body);
          userData.save();
          res.send({ message: "Successfully sign up" });
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } catch (error) {
    res.send({ message: "Something go wrong! Please try again later", alert: false });
  }
});

// api login
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    userModel
      .findOne({ email: email })
      .then((data) => {
        if (data) {
          const dataSend = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            image: data.image,
          };
          res.send({ message: "Successfully Login", alert: true, data: dataSend });
        } else {
          res.send({ message: "Incorrect email or password", alert: false });
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } catch (error) {
    res.send({ message: "Something go wrong! Please try again later", alert: false });
  }
});

// schema product
const ProductSchema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});

// model product
const productModel = mongoose.model("product", ProductSchema);

// upload product
app.post("/upload-product", async (req, res) => {
  try {
    if (req.body) {
      const productData = productModel(req.body);
      productData.save();
      res.send({ message: "Successfully add your product", alert: true, productData });
    } else {
      res.send({ message: "Something is wrong with you product!", alert: false });
    }
  } catch (error) {
    res.send({ message: "Something go wrong! Please try again later", alert: false });
  }
});

// get all products
app.post("/products", (req, res) => {
  try {
    if (req.body) {
      productModel.find({}).then((data) => {
        res.send({ message: "Successfully fetch products", alert: true, data });
      });
    } else {
      res.send({ message: "Something is wrong!", alert: false });
    }
  } catch (error) {
    res.send({ message: "Something go wrong! Please try again later", alert: false });
  }
});

app.listen(PORT, () => console.log("Server is running on port: " + PORT));
