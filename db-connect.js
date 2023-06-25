var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true });

module.exports = mongoose;