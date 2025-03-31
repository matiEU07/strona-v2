//world worker v0
//setup the actual canvas of the software
var canvas = document.querySelector('canvas')
var stats = document.getElementById('stats')
addEventListener("resize", (event) => {});  //refresh on resize
addEventListener("wheel", (event) => {});   //move around with mouse wheel





canvas.width = window.innerWidth
canvas.height = window.innerHeight

var c = canvas.getContext('2d')

//create tile class
function Tile(x, y, type){
    var tile = new Image();
    tile.src = 'tiles/'+type+'.png';
    this.x = x
    this.y = y
    this.draw = function(cmx, cmy){
        c.drawImage(tile, x-cmx, y-cmy, 32, 32)
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
    this.addTile = function(x, y, type) {
        tileArray.push(new Tile(x, y, type))
    }
    this.clearTiles = function(){
        tileArray.pop()
    }
    this.display = function() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        tileArray.forEach((element) => element.draw(cmx,cmy));
        stats.textContent=this.name
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
    cmx = cmx+(16 * (event.deltaY / Math.abs(event.deltaY)))
    c.clearRect(0, 0, canvas.width, canvas.height);
    currentLevel.display()
};

addEventListener('keydown', (event) => {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    switch (event.key) {
        case "ArrowLeft"  : cmx-=8; break;
        case "ArrowRight" : cmx+=8; break;
        case "ArrowUp"    : cmy-=8; break;
        case "ArrowDown"  : cmy+=8; break;
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
    currentLevel.display()
});

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
                var currentKey = ""

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
                            var [key, value] = line.split("=");
                            if (currentKey != key){
                                currentLevel.addTile(x, y, "1")
                                currentKey=key
                            }
                            if (currentKey.endsWith("x")){
                                x=value
                            }
                            if (currentKey.endsWith("y")){
                                 y=value
                            }
                            currentKey=key; break
                        }
                        case "SCENERY ELEMENTS": {
                            var [key, value] = line.split("=");
                            if (currentKey != key){
                                currentLevel.addTile(x, y, "s")
                                currentKey=key
                            }
                            if (currentKey.endsWith("x")){
                                x=value
                            }
                            if (currentKey.endsWith("y")){
                                 y=value
                            }
                            currentKey=key; break
                        }
                        case "BONUS ELEMENTS": {
                            var [key, value] = line.split("=");
                            if (currentKey != key){
                                currentLevel.addTile(x, y, "b")
                                currentKey=key
                            }
                            if (currentKey.endsWith("x")){
                                x=value
                            }
                            if (currentKey.endsWith("y")){
                                 y=value
                            }
                            currentKey=key; break
                        }
                        case "NPC ELEMENTS": {
                            var [key, value] = line.split("=");
                            if (currentKey != key){
                                currentLevel.addTile(x, y, "e")
                                currentKey=key
                            }
                            if (currentKey.endsWith("x")){
                                x=value
                            }
                            if (currentKey.endsWith("y")){
                                 y=value
                            }
                            currentKey=key; break
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
