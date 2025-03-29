//world worker v0
//setup the actual canvas of the software
var canvas = document.querySelector('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

var c = canvas.getContext('2d')
var tileArray = []

//create tile class
function Tile(x, y){
    var tile = new Image();
    tile.src = 'tiles/1.png';
    this.x = x
    this.y = y
    this.draw = function(cmx, cmy){
        c.drawImage(tile, x-cmx, y-cmy, 32, 32)
    }
}


//loading levels
function Load(){
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
        var file = e.target.files[0]; 
        if (file.name.split('.').pop() == "mfel"){

        }
        else{
           alert("not recognised file type. supported file types are only mfel")
        }
}
 

input.click();
}


tileArray.push(new Tile(0, 64))
tileArray.push(new Tile(32, 64))
tileArray.push(new Tile(64, 64))
tileArray.push(new Tile(96, 32))
tileArray.push(new Tile(128, 32))
tileArray.push(new Tile(160, 64))

tileArray.forEach((element) => element.draw(0,0));