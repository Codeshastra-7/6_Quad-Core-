const express = require("express");
const app = express();
const ejs = require("ejs");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const helpers = require("./scripts/helper");
var synonyms = require("synonyms");
const { cheapness } = require("synonyms/dictionary");
const sqlite3 = require("sqlite3").verbose();

var fileNameImage = null;
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/uploads"));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname.trim());
    fileNameImage = file.fieldname + "-" + file.originalname.trim();
  },
});

var upload = multer({ storage: storage });

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

app.get("/register", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", (req, res) => {
  let firstName = req.body.first_name;
  let lastName = req.body.last_name;
  let email = req.body.email;
  let password = req.body.password;
  db.run(
    "INSERT INTO LOGIN(first_name,second_name,email,password) VALUES (?,?,?,?)",
    [firstName, lastName, email, password],
    (err) => {
      if (err) {
        return console.log(err.message);
      }
    }
  );
  res.redirect("/login");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.post("/login", (req, res) => {
  console.log("====================================");
  console.log(req);
  console.log("====================================");
  let password = req.body.passwordlogin;
  let email = req.body.emaillogin;
  sql = "SELECT password from LOGIN where email=?";
  db.get(sql, [email], (err, row) => {
    console.log("====================================");
    console.log(row);
    console.log("====================================");
    if (err) {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    }
    if (row.password == password) {
      res.redirect("/");
    } else {
      res.redirect("/error");
    }
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

app.post("/enter_new_item", upload.single("myFile"), (req, res) => {
  var item_id = new Date().getTime();
  var name = req.body.Item_Name;
  var description = req.body.Item_Description;
  var imageData = fileNameImage;

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
var itemJSON = [];
app.get("/searchData", async (req, res) => {
  let searchQuery = synonyms(req.query.query, "n");
  
  console.log("====================================");
  // console.log(searchQuery);
  var count=0;
  console.log(searchQuery.length)
  const promise1 = new Promise((resolve, reject) => {
    searchQuery.forEach( (item) => {
      db.all(
        "SELECT item_id,item_name,item_image from ITEMS Where item_name like ? ",
        ["%" + item + "%"],
        (err, row) => {
          if (err) console.log(err);
          if (row[0] != null) {
            itemJSON.push(row[0]);
            console.log(row[0]);
          }

          count++;
          console.log(count);
          if(count>=searchQuery.length)
            resolve("Sucess!");
          // console.log(row);
        }
      );
    });
    
    
  });
  promise1.then((value)=>{
    console.log(value);
    let itemLength = itemJSON.length;
    console.log(itemJSON);
    console.log(itemLength);
    res.redirect('/gala?'+itemJSON);
    console.log("====================================");
  
  })
  // var searchQuery = req.body.searchItem;
});


app.get("/gala",(req,res) => {
    res.json( itemJSON );
    res.render('sea')
})

app.listen(3000, () => {
  console.log("====================================");
  console.log("listing on port 3000");
  console.log("====================================");
});
