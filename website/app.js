const express = require("express");
const app = express();
const ejs = require("ejs");
// const json = require("json");
const bodyParser = require("body-parser");


const sqlite3 = require("sqlite3").verbose();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());


app.set('view engine', 'ejs')


let db = new sqlite3.Database("../database/test.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("====================================");
  console.log("connected to in temporary database sqlite");
  console.log("====================================");
});

// db.serialize(() => {
//   db.each(
//     `SELECT item_id as id,item_name as name,item_description as description FROM ITEMS`,
//     (err, row) => {
//       if (err) {
//         console.error(err.message);
//       }
//       console.log(row.id + "\t\t" + row.name + "\t\t" + row.description);
//     }
//   );
// });

// db.serialize(() => {
//   db.each(
//     `SELECT user_id as id,user_name as name,valid_user as valid FROM USERS`,
//     (err, row) => {
//       if (err) {
//         console.error(err.message);
//       }
//       console.log(row.id + "\t\t" + row.name + "\t\t" + row.valid);
//     }
//   );
// });

// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log("Close the database connection.");
// });

app.get('/', (req, res) => {
    var data=null;
    var sql = "select item_id as id,item_id as id,item_id as item_de from ITEMS"
    var params=[]
    db.all(sql,params,(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        console.log(rows);
        res.render('homepage',{data:
            rows
        });
    })
    res.render('homepage',{data:{}});
})

app.get('/getData', (req, res) => {
    var data=null;
    var sql = "select * from USERS"
    var params=[]
    db.all(sql,params,(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        console.log(rows);
        res.render('homepage',{data:
            rows
        });
        // data = json({
        //     "message":"success",
        //     "data":rows
        // })
    })
    // console.log(data);
    // res.render('homepage',{data:data.data});
})

app.listen(3000,()=>{
    console.log('====================================');
    console.log("listing on port 3000");
    console.log('====================================');
})