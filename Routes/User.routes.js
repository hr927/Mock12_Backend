const express = require("express");
const { UserModel } = require("../Model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verify = require("../Middleware/verify.middleware");
const { CalModel } = require("../Model/Cal.model");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, pass, age, city } = req.body;
  try {
    const userExists = await UserModel.find({ email });
    if (
      name === "" ||
      email === "" ||
      pass === "" ||
      age === "" ||
      city === ""
    ) {
      res.send({ msg: "Please Enter all the details" });
    } else {
      if (userExists.length > 0) {
        res.send({ msg: "User already exists" });
      } else {
        bcrypt.hash(pass, 3, async function (err, hash) {
          if (err) {
            res.send({ msg: "Something went wrong", error: err.message });
          } else {
            const user = new UserModel({ name, email, pass: hash, age, city });
            await user.save();
            res.send({ msg: "New User Registered" });
          }
        });
      }
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    if (email === "" || pass === "") {
      res.send({ msg: "Please Enter all the details" });
    } else {
      const user = await UserModel.find({ email });
      if (user.length > 0) {
        bcrypt.compare(pass, user[0].pass, function (err, result) {
          if (result) {
            const token = jwt.sign({ userID: user[0]._id }, "growcal");
            res.send({ msg: "Login Successfull", token: token });
          } else {
            res.send({ msg: "Invalid Credentials" });
          }
        });
      } else {
        res.send({ msg: "No user found please Register" });
      }
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

userRouter.get("/profile", verify, async (req, res) => {
  const user = req.body.userID;
  try {
    const profile = await UserModel.find({ _id: user });
    res.send(profile);
  } catch (error) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

userRouter.post("/calculate", verify, async (req, res) => {
  const { annualAmount, interestRate, years, userID } = req.body;
  try {
    if (annualAmount === "" || interestRate === "" || years === "") {
      res.send({ msg: "Please Enter all the details" });
    } else {
      const total_Investment = annualAmount * years;
      const total_Maturity = Math.floor(
        annualAmount *
          (((1 + interestRate / 100) ** years - 1) / (interestRate / 100))
      );
      const total_Interest = total_Maturity - total_Investment;

      const cal = new CalModel({
        userID,
        total_Investment,
        total_Interest,
        total_Maturity,
      });
      await cal.save();
      res.send(cal);
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

module.exports = { userRouter };
