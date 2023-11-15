const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

app.get("/:jsonPath", (req, res) => {
  const path = req.params.jsonPath;
  console.log(req.params);
  const reader = fs.createReadStream(path);
  if (!fs.existsSync(path)) {
    res.send("File is not exist");
  }
  reader.pipe(res);
});

app.put("/:jsonPath", (req, res) => {
  const path = req.params.jsonPath;
  console.log(req.params);
  const content = req.body;
  let writer = fs.createWriteStream(path);

  writer.write(JSON.stringify(content));
  res.status(200);
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
