var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/agent-management', { useUnifiedTopology: true });

module.exports = mongoose;