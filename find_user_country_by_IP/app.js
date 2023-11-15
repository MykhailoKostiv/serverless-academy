const express = require("express");
const fs = require("fs");
const { parse } = require("csv-parse");
const requestIp = require("request-ip");
const ipInt = require("ip-to-int");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/getCountry", (req, res) => {
  const ip = requestIp.getClientIp(req);
  const newFormat = ipInt(ip).toInt();

  fs.createReadStream("./IP2LOCATION-LITE-DB1.CSV")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      if (newFormat >= row[0] && newFormat <= row[1]) {
        console.log(row[3]);
        return row[3];
      }
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      console.log("finished");
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
