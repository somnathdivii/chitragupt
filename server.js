const bodyparser = require('body-parser')
const express = require("express");
const cors = require("cors");
const ejs = require('ejs');
var path = require('path');
const session = require('express-session');
const dbConfig = require("./app/config/db.config");
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();



const db = require("./app/models");
const Role = db.role;

var corsOptions = {
  origin: "http://localhost:8081"
};




db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

const dbs = db.mongoose.connection;

app.use(session({
  secret: 'testsecrat',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: dbs
  })
}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// app.use(
//   bodyparser.urlencoded({
//     extended: true,
//   })
// );



app.use(express.static(path.join(__dirname, 'app/public/assets')));
// app.use(express.static(path.join(__dirname, 'app/public/views')));
app.set('views', path.join(__dirname, 'app/public/views'));

app.set('view engine', 'ejs');

app.use(morgan('combined'));

// WEB routes
require('./app/routes/index')(app);
require('./app/routes/worker')(app);
require('./app/routes/admin')(app);


// API routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});





// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
