import { c } from "./main.js"; // Import canvas context from main.js

export class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tile = new Image();
        this.tile.src = "tiles/1.png";
    }

    draw(cmx, cmy) {
        c.drawImage(this.tile, this.x - cmx, this.y - cmy, 32, 32);
    }
}
