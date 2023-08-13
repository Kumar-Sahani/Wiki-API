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


//route targeting all articles 

app.route("/articles")
    .get(async function (req, res) {
        try {
            Article.find({}).then(function (foundArticles) {
                res.send(foundArticles);
            });
        }
        catch (error) {
            console.log(error);
        }

    })

    .post(async function (req, res) {
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
    })

    .delete(async function (req, res) {
        try {
            await Article.deleteMany();
            res.send("Deleted Successfully");
        }
        catch (error) {
            res.send(error);
        }
    });


//route targeting specific article

app.route("/articles/:articleTitle")
    .get(async function (req, res) {
        try {
            const foundArticle = await Article.findOne({ title: req.params.articleTitle });
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article found");
            }
        }
        catch (error) {
            console.log(error);
        }
    })



    .put(async function (req, res) {

        try {
            await Article.findOneAndUpdate(
                //condition
                { title: req.params.articleTitle },
                //update
                { title: req.body.title, content: req.body.content },
                //overwrite: true
                { overwrite: true }

            )
            res.send("updated successfully");
        }
        catch (error) {
            console.log(error);
        }

    })

    .patch(async function (req, res) {
        try {
            await Article.findOneAndUpdate(
                //condition
                { title: req.params.articleTitle },
                //flag
                {$set: req.body}
            )
            res.send("updated successfully");
        }
        catch (error) {
            console.log(error);
        }
    })



app.listen(3000, function () {
    console.log("Server started on port 3000");
});



