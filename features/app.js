const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin: true, 
    credentials: true
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser())

app.use("", require("./swagger"));
app.use("", require("./routes"));

module.exports = app;