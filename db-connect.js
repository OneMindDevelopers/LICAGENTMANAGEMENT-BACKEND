var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/agent-management', { useUnifiedTopology: true });

module.exports = mongoose;