const convertMarkdown = markdown => {
    var elements = [];
    var element = [];
    var content = "";
    var command = false;
    var classes = "content";
    var decorations = [];

    var pushElement = (element,content,classes,decorations) => {
        console.log(decorations);
        if(decorations.length != 0) {
            decorations.forEach(element => {
                classes += ` ${element}`
            });
            console.log(classes);
        }
        element.push({
            classes: classes,
            content: content
        })
    }

    for (let char of markdown) {
        if (command) {
            if (char == "<") {
                classes = "content blog-title";
            } else if (char == "b") {
                pushElement(element,content,classes,decorations)
                decorations.push("emphasis");
                content = "";
            } else if (char == "r") {
                pushElement(element,content,classes,decorations)
                decorations = ["inline"];
                content = "";
            }
            command = false
            continue;
        }
        if (char=="\n") {
            pushElement(element,content,classes,decorations)
            elements.push(element);
            decorations = [];
            classes = "content";
            content = "";
            element = [];
        } else if (char == "&") {
            command = true;
        } else {
            content += char;
        }
    }
    pushElement(element,content,classes,decorations)
    elements.push(element)
    return elements;
}
const toStringMarkdown = markdown => {
    let content = "";
    
    let classesDefinition = {"content":"","emphasis":"&b","inline":"&r","blog-title":"&<"}
    console.log(markdown);
    for(let elements of markdown){
        for(let element of elements) {
            for(let classes of element.classes.split(" ")) {
                content += classesDefinition[classes];
            }
            content += element.content;
            console.log(content);
        }
        content += "\n";
    }
    console.log(content);
    return content;
}
module.exports = {
    convertMarkdown : convertMarkdown,
    toStringMarkdown : toStringMarkdown
};