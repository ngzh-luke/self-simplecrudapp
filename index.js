const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
dotenv.config();
const mysql = require("mysql2");
const Pool = require("pg").Pool;
const psql = new Pool({
  // url: process.env._URL,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
});

psql.connect(function (err) {
  if (err) throw console.log(err);
  console.log(`PSQL DB '${process.env.MYSQL_DATABASE}' successfully connect`);
});

// create connection for db
const msql = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

// start connection to db
msql.connect(function (err) {
  if (err) throw console.log(err);
  console.log(`mySQL DB '${process.env.MYSQL_DATABASE}' successfully connect`);
});

const port = process.env.PORT;

const app = express(); // use app
const router = express.Router(); // create middleware module

router.use(express.json()); // parses incoming requests with JSON payloads and is based on body-parser
router.use(express.urlencoded({ extended: true })); // parses incoming requests with urlencoded payloads
app.use("/", router); // use middleware of the given routing path

router.use(express.static(__dirname + "/static")); // using css and js

// get current timestamp
function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

// `root` module route at '/' (get method)
router.get("/index", function (req, res) {
  console.log(`${req.url}`);
  console.log(
    `URL: '${req.originalUrl}' requested at ` + getTimestampInSeconds()
  );
  res.sendFile(path.join(`${__dirname}` + `/index.html`));
});

// `root` module route at '/' (get method)
router.get("/", function (req, res) {
  console.log(`${req.url}`);
  console.log(
    `URL: '${req.originalUrl}' requested at ` + getTimestampInSeconds()
  );
  res.sendFile(path.join(`${__dirname}` + `/vue.html`));
});

router.get("/mysql/view", (req, res) => {
  console.log(`${req.url}`);
  console.log(
    `URL: '${req.originalUrl}' requested at ` + getTimestampInSeconds()
  );
  let sql = "select * from accounts";
  msql.query(sql, function (error, results) {
    error
      ? res.sendStatus(503)
      : console.log(
          "mysql command execute success\n" +
            `${results.length} row(s) returned`
        ); // if not found redirect, else, log

    return res.send(results); // return result
  });
});

router.get("/psql/view", (req, res) => {
  console.log(`${req.url}`);
  console.log(
    `URL: '${req.originalUrl}' requested at ` + getTimestampInSeconds()
  );
  let sql = "select * from accounts";
  psql.query(sql, function (error, results) {
    error
      ? res.sendStatus(503)
      : console.log(
          "psql command execute success\n" + `${results.length} row(s) returned`
        ); // if not found redirect, else, log

    return res.send(results); // return result
  });
});

/* Handle other unspecified paths */
router.use((req, res, next) => {
  console.log("");
  console.log(
    `404: Invalid accessed at URL: '${req.url}' ` +
      "requested at " +
      getTimestampInSeconds()
  );
  res.sendStatus(404);
});

// Server listening
app.listen(port, function () {
  console.log(`Server listening on port: ${port}`);
});

// router.get("/", (req, res) => {
//   res.sendStatus(200);
// });
