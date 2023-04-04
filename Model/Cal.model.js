const mongoose = require("mongoose");
const calSchema = mongoose.Schema({
  userID: String,
  total_Investment: Number,
  total_Interest: Number,
  total_Maturity: Number,
});

const CalModel = mongoose.model("cals", calSchema);

module.exports = { CalModel };
