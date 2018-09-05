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
var port = 3443;
var ca_bundle = fs.readFileSync('/home/pi/rmarques.io/ssl/ca-bundle.pem');
var privateKey = fs.readFileSync('/home/pi/rmarques.io/ssl/rmarques_io_key.pem');
var certificate = fs.readFileSync('/home/pi/rmarques.io/ssl/rmarques_io_crt.pem');
var options = {
    ca: ca_bundle,
    key: privateKey,
    cert: certificate
}

var https = require('https');
https.createServer(options, app).listen(port);
console.log('listening on port '+port);

// Now, to redirect http to https, I will create a secondary server just for this purpose
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(3080);