const express = require("express");
const admin = require("./admins/admin-route");
const agent = require("./agents/agent-route");
const item = require("./items/item-route");
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/admin", admin);
app.use("/agent", agent)
app.use("/item", item)

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Hello World!...")
});

app.listen(port, () => {
    console.log(`Server running at port ${port} `)
});