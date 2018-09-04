// server.js
// load the things we need
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
var fs = require('fs');

app.use( express.static( "public" ) );

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.post('/sendmail', function(req, res) {
    var data = req.body;
    var name = data.name;
    var email = data.email;
    var suggestions = data.suggestions;

    if(!name){
        name=email;
    }
    if (!email || !suggestions) {
        res.send("Error: Email and suggestions should not be Blank");
        return false;
    }

    // rest of email-sending code here
    var smtpTransport = nodemailer.createTransport("smtps://easypeaz2018%40gmail.com:"+encodeURIComponent('pilona3000') + "@smtp.gmail.com:465");
    var whosent = name + " - " + email + " - Sent the following suggestion:<br>"

    var mailOptions = {
        to: "rubenmarques91@gmail.com",
        subject: "New suggestion from "+ name,
        html: whosent + suggestions
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            res.send("Email could not be sent due to error:" +error);
        }else {
            res.send("Email has been sent successfully");
        }
    });
});

app.listen(3000);
console.log('listening on port 3000');