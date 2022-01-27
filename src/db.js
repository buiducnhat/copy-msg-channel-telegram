const mongoose = require('mongoose');
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_DBNAME;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(
        `mongodb+srv://${username}:${password}@${username}.syjjh.mongodb.net/${dbname}?retryWrites=true&w=majority`
      )
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.log(err);
        console.error('Database connection error');
      });
  }
}

module.exports = Database;
