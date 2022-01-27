const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(process.env.MONGODB_URI)
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
