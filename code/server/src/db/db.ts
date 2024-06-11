"use strict"

/**
 * Example of a database connection if using SQLite3.
 */

import { Database } from "sqlite3";

const sqlite = require("sqlite3")

// The environment variable is used to determine which database to use.
// If the environment variable is not set, the development database is used.
// A separate database needs to be used for testing to avoid corrupting the development database and ensuring a clean state for each test.

//The environment variable is set in the package.json file in the test script.
let env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "test"
//let env="test";
// The database file path is determined based on the environment variable.
const dbFilePath = env === "test" ? "./src/db/testdb.db" : "./src/db/db.db"
//change line

// The database is created and the foreign keys are enabled.
const db: Database = new sqlite.Database(dbFilePath, (err: Error | null) => {
    if (err) throw err
    db.run("PRAGMA foreign_keys = ON")
})


function deleteAllData() {
    db.run(`DELETE FROM users`, (err) => {
        if (err) {
            console.log('Error deleting data from user table', err);
        } 
    });
    db.run(`DELETE FROM cart`, (err) => {
        if (err) {
            console.log('Error deleting data from user table', err);
        } 
    });
    db.run(`DELETE FROM product`, (err) => {
        if (err) {
            console.log('Error deleting data from user table', err);
        } 
    });
    db.run(`DELETE FROM cart_product`, (err) => {
        if (err) {
            console.log('Error deleting data from user table', err);
        }
    });
    db.run(`DELETE FROM review`, (err) => {
        if (err) {
            console.log('Error deleting data from user table', err);
        }
    });
    
}



function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer TEXT NOT NULL,
        paid BOOLEAN NOT NULL,
        paymentDate TEXT,
        total REAL NOT NULL
    )`, (err) => {
        if (err) {
            console.log('Error creating cart table', err);
        } else {
            //console.log('Cart table created successfully');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS product (
        sellingPrice REAL NOT NULL,
        model TEXT NOT NULL PRIMARY KEY,
        category TEXT,
        arrivalDate TEXT,
        details TEXT,
        quantity INTEGER NOT NULL
    )`, (err) => {
        if (err) {
            console.log('Error creating product table', err);
        } 
        else {
            //console.log('Cart table created successfully');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS cart_product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cartId INTEGER NOT NULL,
        model TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (cartId) REFERENCES cart(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (model) REFERENCES product(model) ON UPDATE CASCADE ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.log('Error creating cart_product table', err);
        } 
        else {
            //console.log('Cart table created successfully');
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS review (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model TEXT NOT NULL,
        user TEXT NOT NULL,
        score INTEGER NOT NULL,
        date TEXT NOT NULL,
        comment TEXT,
        FOREIGN KEY (model) REFERENCES product(model) ON UPDATE CASCADE ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.log('Error creating review table', err);
        } 
        else {
            //console.log('Cart table created successfully');
        }
    });
}
export default  db;
export {createTables, deleteAllData}