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
    var message = data.message;

    if(!name){
        name=email;
    }
    if (!email || !message) {
        res.send("Error: Email and message should not be Blank");
        return false;
    }

    // rest of email-sending code here
    var smtpTransport = nodemailer.createTransport("smtps://rmarquesio1991%40gmail.com:"+encodeURIComponent('A4kpM;6#{*V*jS)t') + "@smtp.gmail.com:465");
    var whosent = name + " - " + email + " - Sent the following message:<br>"

    var mailOptions = {
        to: "rubenmarques91@gmail.com",
        subject: "New message from "+ name,
        html: whosent + message
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