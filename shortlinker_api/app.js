const express = require("express");
const app = express();
const fs = require("fs");
const short = require("short-uuid");

app.use(express.json());

app.post("/", (req, res) => {
  try {
    const fullUrl = req.body.url;
    if (!fullUrl) {
      return res.status(400).send("URL not specified");
    }

    const shortLink = short.generate();

    const links = JSON.parse(fs.readFileSync("./links.json", "utf-8"));
    links[shortLink] = fullUrl;
    fs.writeFileSync("./links.json", JSON.stringify(links));

    res.send("localhost:3000/" + shortLink);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:id", (req, res) => {
  const id = req.params.id;

  try {
    const links = JSON.parse(fs.readFileSync("./links.json", "utf-8"));

    if (links[id]) {
      res.redirect(links[id]);
    } else {
      res.status(404).send("Link not exist");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
