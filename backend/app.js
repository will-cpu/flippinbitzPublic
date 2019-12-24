const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts");

const subsetRoutes = require("./routes/subsets");

const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://will:" + process.env.MONGO_ATLAS_PW + "@cluster0-w8yqq.mongodb.net/node-angular?retryWrites=true&w=majority")
 .then(() => {
   console.log("Connected to DB!");
 })
 .catch(() => {
   console.log("Connection to DB failed!");
 });




app.use(bodyParser.json());
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',"*"); //Allows which domains are avalible to access our resources
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS"); //Which http words can be used
  next();
});

app.use("/api/posts", postsRoutes);

app.use("/api/setdata", subsetRoutes);

app.use("/api/user", userRoutes);






module.exports = app;
