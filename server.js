const express = require("express");
const bodyParser = require("body-parser");
const pingRoute = require("./routes/pingRoute");

const app = express();



app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// Middlewares
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(pingRoute);

app.get("/", (req, res) => {
    // Health Check
    res.send("The API is up and running.");
  });
  
app.get("*", (req, res) => {
    res.status(404).json({
        error: 404,
        message: "The resource you requested does not exist.",
    });
});

  // Listening port
app.listen(process.env.PORT || 8080, () => {
    console.log(
      `This application is running on port ${process.env.PORT || 8080} `
    );
  });