//world worker v0
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
//setup the actual canvas of the software


var body = document.getElementById('body')
var canvas = document.querySelector('canvas')
var stats = document.getElementById('stats')
addEventListener("resize", (event) => {});  //refresh on resize
addEventListener("wheel", (event) => {});   //move around with mouse wheel
addEventListener("dblclick", (event) => {}); //double click
var activeElements=["BLOCK ELEMENTS", "SCENERY ELEMENTS", "BONUS ELEMENTS", "NPC ELEMENTS", "CUSTOM TILE ELEMENTS", "CUSTOM SCENERY ELEMENTS"]
activeElements.forEach(element => {
    console.log(element)
    checkbox = document.querySelector(`[id='${element}']`);
    checkbox.checked = true;
}) 
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var c = canvas.getContext('2d')
var cursor = new Image()
    cursor.src = 'tiles/select.png'
var mouseX = 0
var mouseY = 0

//generate random id's and stuff
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//create tile class
function Tile(x, y, image, type, key, set){
    var tile = new Image()
    tile.src = 'tiles/'+image+'.png'
    this.type = type
    this.x = x
    this.y = y
    this.hovered = false;
    this.name = key
    this.set = set

    this.setNewImage = function(image){
        tile.src = 'tiles/'+image+'.png'
    }

    this.draw = function(cmx, cmy){
        if (activeElements.includes(this.type)){
        c.drawImage(tile, x-cmx, y-cmy, 32, 32)
        if (this.hovered) {
            c.drawImage(cursor, x-cmx, y-cmy, 32, 32)
            // c.fillStyle = "rgba(255, 255, 255, 0.5)"; // Brighter overlay
            // c.fillRect(this.x - cmx, this.y - cmy, 32, 32);
        }
        }
    }
}
//create level class
function Level(name, name2, name3, time, description, author, mail, site, width, height){

    this.width = width
    this.height = height

    this.name = name+" "+name2+" "+name3

    this.time = time
    this.description = description
    this.author = author
    this.mail = mail
    this.site = site

    var tileArray = []
    this.addTile = function(x, y, image, type, key, set) {
        tileArray.push(new Tile(x, y, image, type, key, set))
    }
    this.clearTiles = function(){
        tileArray.pop()
    }
    this.display = function() {
        if (cmx<0) cmx=0
        c.clearRect(0, 0, canvas.width, canvas.height);
        tileArray.forEach((element) => element.draw(cmx,cmy))
        stats.textContent=this.name
    }
    this.refreshTiles = function() {
        tileArray.forEach((element) => element.setNewImage())
    }
    this.getTile=function(){
        tileArray.forEach(tile => {
            tile.hovered = ( 
                mouseX > tile.x-cmx && 
                mouseX < tile.x-cmx + 32 && 
                mouseY > tile.y-cmy && 
                mouseY < tile.y-cmy + 32
            )
        })
        currentLevel.display()
    }
    this.openTile=function(){     
        tileArray.forEach(tile => {
            if(
                mouseX > tile.x-cmx && 
                mouseX < tile.x-cmx + 32 && 
                mouseY > tile.y-cmy && 
                mouseY < tile.y-cmy + 32
            ){
                createpWindow(tile)
            }
        })
        this.display();
    }
}

var currentLevel = new Level("","","","","","","","","","")
var cmx = 0 //camera x
var cmy = 0 //camera y

onresize = (event) => {
canvas.width = window.innerWidth
canvas.height = window.innerHeight
currentLevel.display()
};

onwheel = (event) => {
    if (event.deltaY){
    // cmx = cmx+(16 * (event.deltaY / Math.abs(event.deltaY)))
    cmx = cmx+ event.deltaY
    currentLevel.display()
    }
};

addEventListener('keydown', (event) => {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if (event.shiftKey) var shift=4; else shift=1
    switch (event.key) {
        case "ArrowLeft"  : cmx-=8*shift; break;
        case "ArrowRight" : cmx+=8*shift; break;
        case "ArrowUp"    : cmy-=8*shift; break;
        case "ArrowDown"  : cmy+=8*shift; break;
    }
    currentLevel.display()
});

canvas.addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top
    })
canvas.addEventListener("click", function(event){
    currentLevel.getTile()
})
canvas.addEventListener("dblclick", function(event){
    currentLevel.openTile()
})



//loading levels
function Load(){
    var input = document.createElement('input')
    input.type = 'file'
    input.onchange = e => { 
        var file = e.target.files[0]
        if (file.name.split('.').pop() == "mfel"){

            var reader = new FileReader()
            
            reader.onload = function(event) {
                var fileContents = event.target.result
                let splitContents=fileContents.split('\n')
            
                var currentSection="none"

                var name = ""
                var name2 = ""
                var name3 = ""
                var width = ""
                var height = ""
                var time = ""
                var description = ""
                var author = ""
                var mail = ""
                var site = ""

                var tile = ""
                var x = 0
                var y = 0
                var set = null
                var currentKey = ""

                function addTiles(line, image){
                    var [key, value] = line.split("=")
                    currentKey=""
                    if (key.endsWith("x")) x=value
                    else if (key.endsWith("y")) y=value
                    else if (key.endsWith("set"))set=value
                    else currentKey=key
                    if(currentKey == key) currentLevel.addTile(x, y, image, currentSection, currentKey, set)
                }

                splitContents.forEach(line => {
                    line = line.replace(/^\uFEFF/, '').replace(/\r/g, '').trim();
                    if (line === "") return; // Skip empty lines & comments
                    if (line.startsWith("[") && line.endsWith("]")) {
                        currentSection = line.slice(1, -1);
                        console.log(line)
                        if (currentSection=="BLOCK ELEMENTS")
                        {
                            currentLevel = new Level(name,name2,name3,time,description,author,mail,site,width,height)
                        }
                        return
                    }
                    switch (currentSection){
                        case "LEVEL PREFERENCES": {
                            var [key, value] = line.split("=");
                            switch(key){
                                case "levelname":{name = value}
                                case "levelname2":{name2 = value}
                                case "levelname3":{name3 = value}
                                case "leveltime":{time = value}
                                case "leveldescription":{description = value}
                                case "levelwidth1":{width = value}
                                case "levelheight1":{height = value}
                                case "levelmail":{mail = value}
                                case "levelsite":{site = value}
                                case "levelauthor":{author = value}
                            }
                        }
                        case "BLOCK ELEMENTS": {
                            addTiles(line, "1")
                            break
                        }
                        case "SCENERY ELEMENTS": {
                            addTiles(line, "s")
                            break
                        }
                        case "BONUS ELEMENTS": {
                            addTiles(line, "b")
                            break
                        }
                        case "NPC ELEMENTS": {
                            addTiles(line, "e")
                            break
                        }
                        case "CUSTOM TILE ELEMENTS": {
                            addTiles(line, "c")
                            break
                        }
                        case "CUSTOM SCENERY ELEMENTS": {
                            addTiles(line, "cs")
                            break
                        }
                    }
                })
                currentLevel.display()
                }

            reader.onerror = function() {
                alert("Error reading file")
            }
            reader.readAsText(file)
        }
        else{
           alert("not recognised file type. supported file types are only mfel")
        }
}
 

input.click();
}
//editing levels
function changeView(type){
    if (activeElements.includes(type))
    {
        activeElements.splice(activeElements.indexOf(type), 1)
    }
    else
    {
        activeElements.push(type)
    }
    currentLevel.display()
}

function createpWindow(tile){
    pWindow = document.createElement('div')
    pWindowTitlebar = document.createElement('div')
    pWindowCloseButton = document.createElement('div')
    pWindowButtonAssign = document.createElement('button')
    pWindowButtonOk = document.createElement('button')
    pWindowButtonCancel = document.createElement('button')
    pWindowBottomButtons = document.createElement('div')
    id = makeid(64)

    pWindow.setAttribute("id", id)
    pWindowTitlebar.setAttribute("id", id+'h')

    pWindow.setAttribute("class", "window")

    pWindowTitlebar.setAttribute("class", "titlebar")
    pWindowTitlebar.textContent=tile.name
    

    pWindowButtonCancel.setAttribute("class", "button")
    pWindowButtonCancel.setAttribute("onclick", "this.parentNode.parentNode.remove()")
    pWindowButtonCancel.textContent="Cancel"

    pWindowButtonAssign.setAttribute("class", "button")
    pWindowButtonAssign.setAttribute("onclick", "this.parentNode.parentNode.remove()")
    pWindowButtonAssign.textContent="Apply"

    pWindowButtonOk.setAttribute("class", "button")
    pWindowButtonOk.setAttribute("onclick", "this.parentNode.parentNode.remove()")
    pWindowButtonOk.textContent="Ok"

    pWindowCloseButton.setAttribute("class", "closeButton")
    pWindowCloseButton.setAttribute("onclick", "this.parentNode.parentNode.remove()")
    
    pWindowBottomButtons.setAttribute("class", "bottomButtons")
    pWindowBottomButtons.append(pWindowButtonOk)
    pWindowBottomButtons.append(pWindowButtonCancel)
    pWindowBottomButtons.append(pWindowButtonAssign)

    // pWindow.textContent = tile.type
    pWindowTitlebar.append(pWindowCloseButton)
    pWindow.append(pWindowTitlebar)
    pWindow.append(pWindowBottomButtons)
    body.append(pWindow)
}
// function moveWindow(id){
//     window = document.getElementById(id)
//     titleBar = document.getElementById(id+'h')
//     console.log("<meow>")
//     console.log(id)
//     console.log("</meow>")
//     document.onmousemove = meow();
// }
// function meow(){
//     console.log("meow")
// }

let dragTarget = null;
let offsetX = 0;
let offsetY = 0;

document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('titlebar')) {
        dragTarget = e.target.parentElement;
        offsetX = e.clientX - dragTarget.offsetLeft;
        offsetY = e.clientY - dragTarget.offsetTop;
        document.body.style.userSelect = 'none';
    }
});

document.addEventListener('mousemove', function(e) {
    if (!dragTarget) return;
    dragTarget.style.left = (e.clientX - offsetX) + 'px';
    dragTarget.style.top = (e.clientY - offsetY) + 'px';
});

document.addEventListener('mouseup', function() {
    dragTarget = null;
    document.body.style.userSelect = '';
});


function dropDownToggle(id) {
  sleep(1).then(() => {
  document.getElementById(id).classList.toggle("show");
});
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
  }
}