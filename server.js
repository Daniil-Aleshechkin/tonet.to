const express = require("express");
const app = express();
const port = 5000;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const articleRouter = require("./routers/articles/articles");
const bodyParser = require("body-parser");
const Article = require("./models/article");

mongoose.connect("mongodb://localhost/blog",{useNewUrlParser: true, useUnifiedTopology:true});

mongoose.connection.once("open", () => {
    console.log("Connected to database");
}).on("error",(error)=> {
    console.log(error);
})

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride("_method"))

app.use("/assets",express.static("assets"));

app.get("/", async (req,res) => {
    const articles = await Article.find().sort( {date: "desc"});
    res.render("index",{articles: articles});
})

app.listen(port);
console.log(`listening on ${port}`)
app.use("/articles",articleRouter);