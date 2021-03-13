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


let db = new sqlite3.Database("../database/db.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("====================================");
  console.log("connected to in temporary database sqlite");
  console.log("====================================");
});

app.get('/', (req, res) => {
    var data=null;
    var sql = "SELECT item_id as id,item_name as name,item_description as valid,item_image as image from ITEMS"
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
})

app.get('/getData', (req, res) => {
    var data=null;
    var sql = "SELECT user_id as id,user_name as name,valid_user as valid from USERS"
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

app.get('/enterData',(req, res) => {
    res.render('newItemEntry');
})

app.post('/enter_new_item',(req, res) => {
    var item_id = new Date().getTime();
    var name = req.body.Item_Name;
    var description = req.body.Item_Description;

    db.run('INSERT INTO ITEMS(item_id,item_name,item_description) VALUES (?,?,?)',[item_id,name,description],(err)=>{
        if(err){
            return console.log(err.message);
        }
        res.redirect('/')
    
    });
})

app.listen(3000,()=>{
    console.log('====================================');
    console.log("listing on port 3000");
    console.log('====================================');
})