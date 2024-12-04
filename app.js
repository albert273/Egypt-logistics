const express = require('express');
const connectToDB = require('./config/connectToDb')
require("dotenv").config()
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/apiError.js");
const cors = require('cors');



// connect to db
connectToDB()

// Init App
const app = express();

app.use(cors());

// middleware 
app.use(express.json())

// Routes
let UserRoute = require("./routers/users.route.js");
let Auth = require("./routers/auth.routers.js");
let Message = require("./routers/message.route.js");
let Quote = require("./routers/quote.route.js");







// APIS
app.use("/api/user", UserRoute);
app.use("/api/auth", Auth);
app.use("/api/message", Message);
app.use("/api/quote", Quote);


app.get("/test", (req, res) => {
    res.json({message: "server is running"});
  });



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
  });
});


// Running server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => 
console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

app.all("*", (req, res, next) => {
    next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
  });
  // Global error handling middleware
  app.use(globalError);
  
// handle Rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});
