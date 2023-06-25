var mongoose = require("mongoose");
await mongoose.connect(process.env.MONGO_URL);

module.exports = mongoose;
