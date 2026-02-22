//world worker v0 by matiEP09

//decoder
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
//setup the actual canvas of the software


var body = document.getElementById('body')
var canvas = document.querySelector('canvas')
var stats = document.getElementById('stats')
var mouseStats = document.getElementById('mouseStats')
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
function Tile(x, y, image, type, key, set, gfx){
    var tile = new Image()
    tile.src = 'tiles/'+image+'.png'
    this.tileGfx = image
    this.gfx = gfx
    this.type = type
    this.x = x
    this.y = y
    this.hovered = false;
    this.name = key
    this.set = set

    this.setNewImage = function(image){
        tile.src = 'tiles/'+image+'.png'
        this.tileGfx = image
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

    this.width = parseFloat(width)
    this.height = parseFloat(height)

    this.name = name+" "+name2+" "+name3

    this.time = time
    this.description = description
    this.author = author
    this.mail = mail
    this.site = site

    var tileArray = []
    this.addTile = function(x, y, image, type, key, set, tile) {
        tileArray.push(new Tile(x, y, image, type, key, set, tile))
    }
    this.clearTiles = function(){
        tileArray.pop()
    }
    this.getTiles = function() {
    return tileArray.slice(); // return copy, not original
    }
    this.display = function() {
        console.log(cmx)

        if (cmx<0) cmx=0
        if (cmx>this.width) cmy=this.width
        // if (cmy<-this.height) cmy = -parseFloat(this.height)
        // if (cmy>parseFloat(this.height)) cmy=parseFloat(this.height)
        cmy = (-canvas.height/2)+(this.height*0.5)
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
    this.getTileArray=function()
    {
        return(tileArray)
    }
}

var currentLevel = new Level("","","","","","","","","","")
var cmx = 0 //camera x
var cmy = 0 //camera y
var scrolltype = "snap"
if (getCookie("scrolltype")!=""){
    scrolltype = getCookie("scrolltype")
}


onresize = (event) => {
canvas.width = window.innerWidth
canvas.height = window.innerHeight
currentLevel.display()
};

function setMovementType(type){
    scrolltype = type
    document.cookie = "scrolltype="+type;
    if (type == "snap"){
        cmx = Math.round(cmx/16)*16
        cmy = Math.round(cmy/16)*16
        currentLevel.display()
    }
}

var scrollinvert=true
onwheel = (event) => {

    if (event.deltaY){
    if (scrolltype=="snap"){
        if (scrollinvert){
            cmy = cmy+(16 * (event.deltaY / Math.abs(event.deltaY)))
        }
        else{
            cmx = cmx+(16 * (event.deltaY / Math.abs(event.deltaY)))
        }
    }
    else{
        if (scrollinvert){
            cmy = cmy+ event.deltaY
        }
        else
        {
            cmx = cmx+ event.deltaY
        }
    }
    currentLevel.display()
    }
    if (event.deltaX){
    if (scrolltype=="snap"){
        if (scrollinvert){
            cmx = cmx+(16 * (event.deltaX / Math.abs(event.deltaX)))
        }
        else{
            cmy = cmy+(16 * (event.deltaX / Math.abs(event.deltaX)))
        }
    }
    else{
        if (scrollinvert){
            cmx = cmx+ event.deltaX
        }
        else
        {
            cmy = cmy+ event.deltaX
        }
    }
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
    mouseStats.innerText="mouse x: "+parseInt(mouseX+cmx)+" mouse y: "+parseInt(mouseY+cmy)
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
                    else {currentKey=key; tile = value
                    if (decoder.indexOf(tile) != -1) {image = decoder.indexOf(tile);}
                    }
                    if(currentKey == key) currentLevel.addTile(x, y, image, currentSection, currentKey, set, tile)
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

    var pWindow = document.createElement('div')
    var pWindowTitlebar = document.createElement('div')
    var pWindowBottomButtons = document.createElement('div')
    var id = makeid(64)

    pWindow.setAttribute("id", id)
    pWindow.setAttribute("class", "window")

    // --- Position at mouse cursor, clamped to viewport ---
    var winW = 400, winH = 220
    var spawnX = Math.min(mouseX, window.innerWidth - winW - 8)
    var spawnY = Math.max(40, Math.min(mouseY, window.innerHeight - winH - 8))
    pWindow.style.left = spawnX + "px"
    pWindow.style.top  = spawnY + "px"

    // --- Titlebar (must be first child for dragging to work) ---
    pWindowTitlebar.setAttribute("id", id+'h')
    pWindowTitlebar.setAttribute("class", "titlebar")

    var titleText = document.createTextNode(tile.name)
    pWindowTitlebar.append(titleText)

    var closeBtn = document.createElement('button')
    closeBtn.className = "closeButton"
    closeBtn.onclick = function() { pWindow.remove() }
    pWindowTitlebar.append(closeBtn)
    pWindow.append(pWindowTitlebar)

    // --- Tile image preview + info row ---
    var topRow = document.createElement('div')
    topRow.style.cssText = "display:flex; align-items:center; padding: 8px 8px 4px 8px; gap:8px;"

    var tileDisplay = document.createElement("img")
    tileDisplay.className = "pixel"
    tileDisplay.src = "tiles/" + tile.tileGfx + ".png"
    tileDisplay.style.cssText = "width:32px; height:32px; image-rendering:pixelated; flex-shrink:0;"
    topRow.append(tileDisplay)

    var infoBlock = document.createElement('div')
    infoBlock.style.cssText = "font-size:13px; color:rgba(174,174,174,0.7); line-height:1.5;"
    var makeRow = function(label, value) {
        var s = document.createElement('span')
        s.style.display = "block"
        s.textContent = label + ": " + value
        return s
    }
    infoBlock.append(makeRow("Type", tile.type))
    infoBlock.append(makeRow("Set", tile.set))
    infoBlock.append(makeRow("Position", "x=" + tile.x + "  y=" + tile.y))
    topRow.append(infoBlock)
    pWindow.append(topRow)

    // --- Separator ---
    var sep = document.createElement('div')
    sep.style.cssText = "border-top: 1px solid rgba(255,255,255,0.07); margin: 4px 0;"
    pWindow.append(sep)

    // --- Tile gfx dropdown row ---
    var editRow = document.createElement('div')
    editRow.style.cssText = "padding: 6px 8px; display:flex; align-items:center; gap:8px;"

    var gfxLabel = document.createElement('span')
    gfxLabel.textContent = "Tile:"
    gfxLabel.style.cssText = "font-size:13px; color:rgba(174,174,174,0.9); white-space:nowrap;"
    editRow.append(gfxLabel)

    var select = document.createElement('select')
    select.style.cssText = "background:rgba(255,255,255,0.08); color:rgb(174,174,174); border:1px solid rgba(255,255,255,0.15); border-radius:4px; padding:2px 4px; font-family:inherit; font-size:13px; flex:1;"

    // Collect all gfx names: decoder entries + every gfx used in the current level
    var allGfxNames = new Set(decoder.filter(d => d !== ""))
    currentLevel.getTileArray().forEach(function(t) { if (t.gfx) allGfxNames.add(t.gfx) })
    var decoderOptions = [...allGfxNames].sort()
    if (tile.gfx && !decoderOptions.includes(tile.gfx)) {
        decoderOptions.unshift(tile.gfx)
    }
    decoderOptions.forEach(function(name) {
        var opt = document.createElement('option')
        opt.value = name
        opt.textContent = name
        if (name === tile.gfx) opt.selected = true
        select.append(opt)
    })

    // Live preview on change
    select.addEventListener('change', function() {
        var imgIndex = decoder.indexOf(select.value)
        tileDisplay.src = imgIndex !== -1 ? "tiles/" + imgIndex + ".png" : "tiles/" + tile.tileGfx + ".png"
        titleText.textContent = select.value
    })

    editRow.append(select)
    pWindow.append(editRow)

    // --- Bottom buttons ---
    pWindowBottomButtons.setAttribute("class", "bottomButtons")

    function applyChanges() {
        var selectedGfx = select.value
        var imgIndex = decoder.indexOf(selectedGfx)
        // Only update the image if we have a valid decoder mapping for the new name
        if (imgIndex !== -1) {
            tile.setNewImage(imgIndex)
        }
        // Always update gfx name so export reflects the change
        tile.gfx = selectedGfx
        tile.name = selectedGfx
        currentLevel.display()
        titleText.textContent = selectedGfx
    }

    var cancelBtn = document.createElement('button')
    cancelBtn.className = "button"
    cancelBtn.textContent = "Cancel"
    cancelBtn.onclick = function() { pWindow.remove() }

    var applyBtn = document.createElement('button')
    applyBtn.className = "button"
    applyBtn.textContent = "Apply"
    applyBtn.onclick = applyChanges

    var okBtn = document.createElement('button')
    okBtn.className = "button"
    okBtn.textContent = "Ok"
    okBtn.onclick = function() { applyChanges(); pWindow.remove() }

    pWindowBottomButtons.append(okBtn)
    pWindowBottomButtons.append(cancelBtn)
    pWindowBottomButtons.append(applyBtn)
    pWindow.append(pWindowBottomButtons)

    body.append(pWindow)
}

function Preferences(){
    pWindow = document.createElement('div')
    pWindowTitlebar = document.createElement('div')
    pWindowCloseButton = document.createElement('div')
    pWindowButtonAssign = document.createElement('button')
    pWindowBottomButtons = document.createElement('div')




    id = makeid(64)

    pWindow.setAttribute("id", id)
    pWindowTitlebar.setAttribute("id", id+'h')

    pWindow.setAttribute("class", "window")

    pWindowTitlebar.setAttribute("class", "titlebar")
    pWindowTitlebar.textContent="Preferences"

    pWindowButtonAssign.setAttribute("class", "button")
    pWindowButtonAssign.setAttribute("onclick", "this.parentNode.parentNode.remove()")
    pWindowButtonAssign.textContent="Apply"

    pWindowCloseButton.setAttribute("class", "closeButton")
    pWindowCloseButton.setAttribute("onclick", "this.parentNode.parentNode.remove()")
    
    pWindowBottomButtons.setAttribute("class", "bottomButtons")

    pWindowBottomButtons.append(pWindowButtonAssign)

    // pWindow.textContent = tile.type
    pWindowTitlebar.append(pWindowCloseButton)
    pWindow.append(pWindowTitlebar)

    pWindowLabel1 = document.createElement('div')
    pWindowLabel1.setAttribute('class', 'preferencesLabel')
    pWindowLabel1.textContent = "Movement Type:"
    pWindow.append(pWindowLabel1)

    radiobutton = document.createElement('input')
    radiobutton.setAttribute("type","radio")
    radiobutton.setAttribute("name","scrolltype")
    radiobutton.setAttribute("onclick", "setMovementType('smooth')")

    radiobuttonLabel = document.createElement('label')
    radiobuttonLabel.setAttribute("class", "radioContainer")
    radiobuttonLabel.textContent="smooth"
    
    radiobuttonLabel.append(radiobutton)
    pWindow.append(radiobuttonLabel)

    radiobutton = document.createElement('input')
    radiobutton.setAttribute("type","radio")
    radiobutton.setAttribute("name","scrolltype")
    radiobutton.setAttribute("onclick", "setMovementType('snap')")

    radiobuttonLabel = document.createElement('label')
    radiobuttonLabel.setAttribute("class", "radioContainer")
    radiobuttonLabel.textContent="snap"

    radiobuttonLabel.append(radiobutton)
    pWindow.append(radiobuttonLabel)

    pWindow.append(pWindowBottomButtons)
    body.append(pWindow)
}

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

function ExportToCSharp()
{
    const tileSize = 32;

    const gridWidth = Math.ceil(currentLevel.width / tileSize);
    const gridHeight = Math.ceil(currentLevel.height / tileSize);

    // create empty grid
    let grid = [];
    for (let y = 0; y < gridHeight; y++) {
        grid[y] = [];
        for (let x = 0; x < gridWidth; x++) {
            grid[y][x] = "";
        }
    }

    // use getter
    var tiles = currentLevel.getTiles();

    const gfxToCode = {
        "Terrain 001": "g1", //ground tiles
        "Terrain 002": "g2",
        "Terrain 003": "g3",
        "Terrain 006": "g6",
        "Terrain 005": "g5",
        "Terrain 004": "g4",
        

        
        "Pipe 001": "p1", //pipe
        "Pipe 002": "p2",
        "Pipe 003": "p3",
        "Pipe 004": "p4",

        "Block 002": "b",
        "Block 050": "brdg",
        "Block 064": "brdg",
        
        "Bonus 011": "br", 
        "Bonus 010": "br", 

        
        "Bonus 012": "c1", 
        "Bonus 002": "q1", 
        "Bonus 004": "q1", 
        // "Bonus 010": "q1", 
    
        "Common 020" : "",
    };


    tiles.forEach(tile => {

        const gx = Math.floor(tile.x / tileSize);
        const gy = Math.floor(tile.y / tileSize);
        if (gx >= 0 && gy >= 0 && gx < gridWidth && gy < gridHeight)
        {
            let value = "";
            if (tile.type != "SCENERY ELEMENTS"){
            value = gfxToCode[tile.gfx] || tile.gfx || "";
            grid[gy][gx] = value;
            }
        }

    });

    let output = "public string[,] _level = new string[,]\n{\n";

    for (let y = 0; y < gridHeight; y++)
    {
        output += "    {";

        for (let x = 0; x < gridWidth; x++)
        {
            output += `"${grid[y][x]}"`;
            if (x < gridWidth - 1) output += ",";
        }

        output += "}";
        if (y < gridHeight - 1) output += ",";
        output += "\n";
    }

    output += "};";

    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "level_export.cs";
    link.click();
}








// get cookies

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}