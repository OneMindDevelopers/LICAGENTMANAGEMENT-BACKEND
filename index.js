const express = require("express");
const admin = require("./admins/admin-route");
const agent = require("./agents/agent-route");
const item = require("./items/item-route");
const customer = require("./customers/customer-route");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/admin", admin);
app.use("/agent", agent);
app.use("/item", item);
app.use("/customers", customer);

const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello NodeJS World!...");
});

app.use(
  express.static(path.join(__dirname, "./LICAGENTMANAGEMENT-FRONTEND/build"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./LICAGENTMANAGEMENT-FRONTEND/build/index.html")
  );
});

app.listen(port, () => {
  console.log(`Server running at port ${port} `);
});
