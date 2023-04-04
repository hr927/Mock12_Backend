const express = require("express");
const connection = require("./configs/db");
const cors = require("cors");
const { userRouter } = require("./Routes/User.routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.use("/user", userRouter);
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (err) {
    console.log(err);
  }
});
