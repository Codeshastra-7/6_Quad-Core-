const express = require('express');
const app = express();

const bodyParser = require('bodyParser');



const sqlite3 = require('sqlite3').verbose();

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());

let db = new sqlite3.Database('../database/test.db',(err)=>{
    if(err){
        return console.error(err.message);
    }
    console.log('====================================');
    console.log("connected to in temporary database sqlite");
    console.log('====================================');
});




db.serialize(()=>{
    db.each(`SELECT item_id as id,item_name as name,item_description as description FROM ITEMS`,(err,row)=>{
        if(err){
            console.error(err.message);
        }
        console.log(row.id + '\t\t' + row.name +'\t\t' + row.description);
    })
})

db.serialize(()=>{
    db.each(`SELECT user_id as id,user_name as name,valid_user as valid FROM USERS`,(err,row)=>{
        if(err){
            console.error(err.message);
        }
        console.log(row.id + '\t\t' + row.name +'\t\t' + row.valid);
    })
})

db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });