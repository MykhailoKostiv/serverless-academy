const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routers/index.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
