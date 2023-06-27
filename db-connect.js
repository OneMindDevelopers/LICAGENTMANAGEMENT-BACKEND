var mongoose = require("mongoose");
mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
});

module.exports = mongoose;
