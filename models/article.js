const mongoose = require("mongoose")
const Schema = mongoose.Schema

const markdownSchema = new Schema({
    type: Object,
    required : ["content"],
    properties: {
        classes: String,
        content: String
    }
})

const articleSchema = new Schema( {
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    markdown: {
        type: "array",
        items: {
            type: markdownSchema
        }
    },
    imgURL: {
        type: String,
    }
})

module.exports = mongoose.model("Article",articleSchema)