var UID = {
	_current: 0,
	getNew: function(){
		this._current++;
		return this._current;
	}
};

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = "pseudoStyles";
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
	_sheet.id = _sheetId;
	var className = "pseudoStyle" + UID.getNew();
	
	_this.className +=  " "+className; 
	
	_sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
	_head.appendChild(_sheet);
	return this;
};

function hideBanner(){
    if (window.scrollY!=0) {
        document.querySelector(".navbar").style.top = "10px";
        document.querySelector(".banner").style.top = "-600px";
        document.querySelector(".back").style.marginTop = "-600px";
    } else {
        document.querySelector(".banner").style.top = "0px";
        document.querySelector(".navbar").style.top = "700px";
        document.querySelector(".back").style.marginTop = "0px"
    }
}

function grabButton(e) {
    buttonDrag = e.target;
    let i = buttonDrag.getAttribute("id");
    buttonDrag.style.backgroundColor = "#ffa400";
    buttonDrag.style.color = "#011627";
    buttonBound = buttonPos[i];
    setTimeout(function () {
        linkPage(i);
    },100)
}
function reset(){
    if (!buttonDrag) return;
    
    buttonDrag.style.backgroundColor = "#231F20";
    buttonDrag.style.color = "#E8F1F2";
    buttonDrag = null;
}
function linkPage(i) {
    var pages = ["../index.html","./about.html","./contact.html","","","./new"];
    if (pages[i]==""||buttonDrag != null||window.location.pathname == "/pages"+pages[i].substr(1,pages[i].length-1)) return;
    
    if (window.location.pathname== "/index.html"||window.location.pathname=="/") {
        if (i==0) return;
        
        location.replace("./articles"+pages[i].substr(1,pages[i].length-1));
    } else {
        location.replace(pages[i]);
    }

}
function hover(e) {
    if (!buttonDrag) {
        e.target.style.backgroundColor = "#5BC0EB";
    }
}
function leave(e) {
    if (!buttonDrag) {
        e.target.style.backgroundColor = "#231F20";
    }
}

var buttons = document.querySelectorAll(".nav-button-container")
var buttonDrag = null;
var previousX = null;
var closeButton = document.querySelector(".fa-times");
var bounds = [document.body.getBoundingClientRect().left,document.body.getBoundingClientRect().right];
var buttonPos = [];
var buttonBound = 0;

document.querySelectorAll(".list-item").forEach((element,i) => {
    element.style.top = 0;
    element.style.opacity = 1;
})
document.querySelector(".banner").pseudoStyle("before","transform","skew(55deg) translateX(-55%)");
document.querySelector(".banner").pseudoStyle("after","transform","skew(-20deg) translateX(-55%)");

if (closeButton != null) {
    closeButton.addEventListener("click",function () {
        document.querySelector(".follow").style.bottom = "-50px";
    })
}

document.body.addEventListener("mousemove",function moveButton(e) {
    if (buttonDrag==null) {
        return;
    }
    var previousLeft = 0;
    if (buttonDrag.style.left!="") {
        previousLeft = parseInt(buttonDrag.style.left.substr(0,buttonDrag.style.left.length));
    }
    if (previousLeft + e.movementX<bounds[0]-buttonBound[0]) {
        console.log("left")
        buttonDrag.style.left = bounds[0]-buttonBound[0]+"px";
    } else if (previousLeft+e.movementX>bounds[1]-buttonBound[1]) {
        console.log("right")
        buttonDrag.style.left = bounds[1]-buttonBound[1]+"px";
    } else {
        console.log("move");
        buttonDrag.style.left = previousLeft + e.movementX + "px";
    }
})
document.body.addEventListener("mouseup",reset);
document.body.addEventListener("mouseleave",reset);
document.addEventListener("scroll",hideBanner);

buttons.forEach((element,i) => {
    var buttonbounds = [element.getBoundingClientRect().left,element.getBoundingClientRect().right]
    element.addEventListener("mousedown",grabButton);
    element.addEventListener("mouseenter",hover);
    element.addEventListener("mouseleave",leave);
    element.setAttribute("id",i);
    buttonPos.push(buttonbounds);
});
