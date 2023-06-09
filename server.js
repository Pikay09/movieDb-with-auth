const express = require("express");
const mongoose = require("mongoose");
const server = express();
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passport.config");
const expressLayouts = require("express-ejs-layouts");
const MongoStore = require("connect-mongo");
const cloudinary = require('cloudinary')
const multer = require('multer');
const upload = multer();
//const fs = require('fs')

const authController = require("./controllers/auth.controller");
const moviesController = require("./controllers/movie.controller");
const bodyParser = require("body-parser");

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("Mongo connected"));


cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret //process.env
});

server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(expressLayouts);
/*-- These must be place in the correct place */
server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB, //Store session in mongodb to preview re-login on server reload
    }),
  })
);
//-- passport initialization
server.use(bodyParser.json()); 
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());
server.use(express.static("uploads"))

server.use(function (request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash(); //{ success: [], error: []}
  response.locals.currentUser = request.user;
  next();
});

server.use("/", moviesController);
server.use("/auth", authController);

server.get('/upload', (req,res)=>{
  cloudinary.v2.uploader.upload('uploads/posterUrl-1686212103366-972145263.jpg')
  .then((result)=>console.log(result))
})

server.get("*", (req, res) => {
  res.send("does not exist");
});

server.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);
