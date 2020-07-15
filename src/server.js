const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoutes");

require("dotenv").config();

const port = process.env.PORT || 5000;
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(
  process.env.DB_URL,

  dbOptions,
  (err) => {
    if (err) {
      console.log("DB not connected");
      console.log(err);
    } else {
      console.log("DB connected");
    }
  }
);

app.use(cors());
app.use(logger("tiny"));
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.listen(5000, () => console.log("Server started at http://localhost:5000"));
