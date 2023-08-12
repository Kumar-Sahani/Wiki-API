//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


//connecting to DB
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

//creating schema
const articleSchema = {
    title: String,
    content: String
};

//creating a model for the above schema
const Article = mongoose.model("Article", articleSchema);


//get method for requsting all the articles
app.get("/articles", function (req, res) {

    Article.find({}).then(function (foundArticles) {
        res.send(foundArticles);
    })
        .catch(function (err) {
            console.log(err);
        });

});

//another way of writing the get methos with async function
//app.get("/articles", async function (req, res) {
//    try {
//        Article.find({}).then(function (foundArticles) {
//            res.send(foundArticles);
//        });
//    }
//    catch (error) {
//        console.log(error);
//    }

//})


//post method for adding one article in the DB
app.post("/articles", async function (req, res) {

    try {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        await newArticle.save();
        res.send("Successfully added a new article.");

    } catch (error) {
        res.send(error);
    }

});

app.deleteMany("/articles", function (req, res) {
    Article.deleteMany(function (error) {
        if (!error) {
            res.send("Deleted Successfully")
        } else {
            res.send(error);
        }
    })
})


app.listen(3000, function () {
    console.log("Server started on port 3000");
});



