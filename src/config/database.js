const { mongoose } = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namasteDev:RlxYDK1nsidLjN9I@namastenode.qjudmet.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
