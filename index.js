const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
dotenv.config();
// const mysql = require("psql");
const port = process.env.PORT;

const app = express(); // use app
const router = express.Router(); // create middleware module

router.use(express.json()); // parses incoming requests with JSON payloads and is based on body-parser
router.use(express.urlencoded({ extended: true })); // parses incoming requests with urlencoded payloads
app.use("/", router); // use middleware of the given routing path

app.use(express.static(__dirname + "/static")); // using css and js

// get current timestamp
function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

// `root` module route at '/' (get method)
router.get("/", function (req, res) {
  console.log("");
  console.log(
    `URL: '${req.originalUrl}' requested at ` + getTimestampInSeconds()
  );
  res.sendFile(path.join(`${__dirname}` + `/index.html`));
});

// Server listening
app.listen(port, function () {
  console.log(`Server listening on port: ${port}`);
});

// router.get("/", (req, res) => {
//   res.sendStatus(200);
// });
