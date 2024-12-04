const mongoose = require('mongoose')


const dbConnection = () => {
    mongoose
      .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => {
        console.log(`Database connected: ${conn.connection.host}`);
      });
  };
  module.exports = dbConnection;