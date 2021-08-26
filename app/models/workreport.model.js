const mongoose = require("mongoose");

const Workreport = mongoose.model(
  "Workreport",
  new mongoose.Schema({
    xpname: String,
    workreport: String,
    timespent: String,
    user_id: String,
    date: Date,
    published: Boolean
  },
    { timestamps: true })
);

module.exports = Workreport;