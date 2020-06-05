const mysql = require('mysql');
const express = require('express');
const db_name = "webcrawler_db";
const environment = require('./environment');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: `${environment.dbPassword}`
});

let createDbQuery = `CREATE DATABASE IF NOT EXISTS ${environment.dbName}`;
let useDbQuery = `USE ${environment.dbName}`;

let createDbFunction = ()=>{
    db.query(createDbQuery, (err, result)=>{
        if(err){
            console.log(`error in creating db: ${err}`);
        }
        else{
            console.log(result);
        }
    });

    db.query(useDbQuery, (err, result)=>{
        if(err){
            console.log(`error in using db: ${err}`);
        }
        else{
            console.log(result);
        }
    })
}

createDbFunction();
module.exports = db;