const express = require("express");
const app = express();
const ejs = require("ejs");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const helpers = require("./scripts/helper");

const sqlite3 = require("sqlite3").verbose();


var fileNameImage=null;
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/uploads"));


app.set("view engine", "ejs");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-'+file.originalname.trim());
      fileNameImage=file.fieldname + '-'+file.originalname.trim();
    }
  })
  
  var upload = multer({ storage: storage })

let db = new sqlite3.Database("../database/image_db.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("====================================");
  console.log("connected to in temporary database sqlite");
  console.log("====================================");
});

app.get("/", (req, res) => {
  var data = null;
  var sql =
    "SELECT item_id as id,item_name as name,item_description as valid,item_image as image from ITEMS";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.log(rows);

    res.render("homepage", { data: rows });
  });
});

app.get("/getData", (req, res) => {
  var data = null;
  var sql =
    "SELECT user_id as id,user_name as name,valid_user as valid from USERS";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.log(rows);
    res.render("homepage", { data: rows });
  });
});

app.get("/enterData", (req, res) => {
  res.render("newItemEntry");
});

app.post("/enter_new_item",upload.single('myFile'), (req, res) => {
  var item_id = new Date().getTime();
  var name = req.body.Item_Name;
  var description = req.body.Item_Description;
  var imageData = fileNameImage;
  
//   console.log('====================================');
//   console.log(req.file);
//   console.log('====================================');
  db.run(
    "INSERT INTO ITEMS(item_id,item_name,item_description,item_image,user_id) VALUES (?,?,?,?,?)",
    [item_id, name, description, imageData, 1],
    (err) => {
      if (err) {
        return console.log(err.message);
      }
    }
  );
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("====================================");
  console.log("listing on port 3000");
  console.log("====================================");
});
