const express = require("express");
const Article = require("./../../models/article")
const markdownConvert = require("./../../bin/markdown-converter")
const multer = require("multer");
const methodOverride = require("method-override");


const storage = multer.diskStorage( {
    destination: (req,file,cb) => {
        cb(null,"./assets/images");
    },
    filename: (req,file,cb) => {
        cb(null,new Date().toISOString().replace(/:/g,"-")+"__"+file.originalname);
    }
})

const upload = multer({storage:storage}).single("blogImage");

const router = express.Router();

router.get("/new",(req,res)=> {
    let article = new Article({
        title: "",
        markdown: []
    });

    res.render("new-post",{article:article,markdownConvert: markdownConvert});
})

router.get("/:id",async (req,res)=> { 
    const article = await Article.findById(req.params.id);
    
    res.render("article",{article : article, markdownConvert : markdownConvert})
})
router.get("/edit/:id", async (req,res) => {
    const article = await Article.findById(req.params.id);

    res.render("edit",{article : article, markdownConvert : markdownConvert})
})
router.put("/:id",upload, async (req,res,next) => {
    req.article = new Article();
    next();
}, saveAndPut("edit"));

router.post("/", upload, async (req,res,next) => {
    req.article = new Article();
    next();
}, saveAndPut("new-post"));

router.delete("/:id", async (req,res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/")
}) 

function saveAndPut(path) {
    return async (req,res) => {
        req.article.title = req.body.title
        req.article.date = new Date()
        req.article.markdown = markdownConvert.convertMarkdown(req.body.markdown), //Process text into JSON object
        req.article.imgURL = `/assets/images/${req.file.filename}`;
        if (path== "edit") {
            await Article.findByIdAndDelete(req.params.id);
        }
        try {
            article = await req.article.save();
            res.redirect(`/articles/${article._id}`)
        } catch (error) {
            console.log(error);
            console.log(article);
            res.render(path, {article: article, markdownConvert: markdownConvert});
        }}
}

module.exports = router;