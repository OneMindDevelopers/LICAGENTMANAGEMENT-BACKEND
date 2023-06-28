var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://oneminddevelopers:aaA0enJB3qXLoJRK@cluster0.5rb4qhy.mongodb.net/",
  {
    useUnifiedTopology: true,
  }
);

module.exports = mongoose;
