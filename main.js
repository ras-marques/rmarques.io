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

// add recipes page
app.get('/add', function(req, res) {
    res.render('pages/add');
});

app.get('/recipes.json', function(req, res) {
    var recipes;
    fs.readFile('recipes.json', 'utf8', function (err, data) {
        if (err) throw err;
        recipes = JSON.parse(data);
        res.json(recipes);
    });
});

app.get('/ingredients.json', function(req, res) {
    var ingredients;
    fs.readFile('ingredients.json', 'utf8', function (err, data) {
        if (err) throw err;
        ingredients = JSON.parse(data);
        res.json(ingredients);
    });
});

// all recipes page
app.get('/show_all', function(req, res) {
    res.render('pages/show_all');
});

// all recipes page
app.get('/suggestions', function(req, res) {
    res.render('pages/suggestions');
});

function inArray(elem,array_to_check){
    var count=array_to_check.length;
    for(var i=0;i<count;i++){
        if(array_to_check[i]===elem){return true;}
    }
    return false;
}

app.post('/search_result', function(req, res) {
    var checked_ingredients_json = req.body;
    //console.log(checked_ingredients_json)
    checked_ingredients_array=[];
    for(var ingredient in checked_ingredients_json){
        checked_ingredients_array.push(ingredient);
    }
    //console.log(checked_ingredients_array)

    var recipes_to_send = {}
    var fs = require('fs');
    fs.readFile('recipes.json', 'utf8', function (err, data) {
        if (err) throw err;
        var recipes_list = JSON.parse(data);
        for (var recipe in recipes_list) {
            var recipe_valid = true;
            for (var i = 0; i < recipes_list[recipe]["ingredients"].length; i++) {
                if (!inArray(recipes_list[recipe]["ingredients"][i], checked_ingredients_array)) {
                    recipe_valid = false
                }
            }
            if (recipe_valid) {
                recipes_to_send[recipe]={"recipe_link": recipes_list[recipe]["recipe_link"]}
            }
        }
        //var myJSON = JSON.stringify(recipes_to_send);
        //console.log(recipes_to_send);
        res.json(recipes_to_send);
        //res.render('pages/search_result');
    });
});

// add recipes page
app.post('/add', function(req, res) {
    var data = req.body;
    var new_recipe_name = data.recipe_name;
    var new_recipe_link = data.recipe_link;
    var new_recipe_ingredients = [];
    for(var key in data){
        if(key != "recipe_name" && key != "recipe_link" && !key.includes("add")){
            new_recipe_ingredients.push(key);
        }
    }

    var fs = require('fs');
    var recipes;
    fs.readFile('recipes.json', 'utf8', function (err, data) {
        if (err) throw err;
        recipes = JSON.parse(data);

        recipes[new_recipe_name] = {"recipe_link": new_recipe_link, "ingredients": new_recipe_ingredients}
        var myJSON = JSON.stringify(recipes);

        fs.writeFile("recipes.json", myJSON, function(err) {
            if (err) {
                console.log(err);
            }
        });

        //console.log(recipes);
    });
});

// add ingredient page
app.post('/add_ingredient', function(req, res) {
    var data = req.body;
    var ingredient_column = data["ingredient_column"];
    var ingredient_name = data["ingredient_name"];
    //console.log(ingredient_column+":"+ingredient_name);

    var fs = require('fs');
    var ingredients;
    fs.readFile('ingredients.json', 'utf8', function (err, data) {
        if (err) throw err;
        ingredients = JSON.parse(data);
        ingredients_to_write = {};
        //console.log(ingredients);
        var new_ingredient_column_array = [];
        for(var key in ingredients){
            if(key==ingredient_column){
                new_ingredient_column_array=ingredients[key];
                new_ingredient_column_array.push(ingredient_name);
                ingredients_to_write[key]=new_ingredient_column_array;
            }
            else{
                ingredients_to_write[key]=ingredients[key];
            }
        }
        //console.log(ingredients_to_write);
        var myJSON = JSON.stringify(ingredients_to_write);

        fs.writeFile("ingredients.json", myJSON, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
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