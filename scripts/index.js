images = [
    "assets/images/",
    "1-1.png",
    "tiles.png",
    "mario.png"
];

audio = [
    ""
];

var qBlink = 0;
var cameraX;

function update() {
    if(keyPress[k.p]) {paused=!paused;}
    mario.update();
    var marioXPos = ~~(mario.x*32);
    if(marioXPos - cameraX > 0) {
        cameraX = marioXPos;
        if(cameraX > level[0].length*32 + cw/2) {
            cameraX = level[0].length*32 + cw/2;
        }
    }
    centerCameraOn(cameraX,ch/2);
}

function getCollisions(tileX,tileY) {
    
    tileX = Math.round(tileX) - 1;
    tileY = Math.round(tileY) - 1;

    tileX = Math.max(0,tileX);
    tileY = Math.max(0,tileY);
    tileX = Math.min(level[0].length-3,tileX);
    tileY = Math.min(level.length-3,tileY);

    var collisions = [];

    for(var y=tileY;y<tileY+3;y++) {
        for(var x=tileX;x<tileX+3;x++) {
            if(level[y][x] !== "air") {
                collisions.push({x:x,y:y,w:1,h:1});
            }
        }
    }

    return collisions;
}

function colliding(rect,collisions) {
    for(var j=0;j<collisions.length;j++) {
        if(rectrect(rect,collisions[j])) {
            return collisions[j];
        }
    } 
    return false;
}

function draw() {
    for (var x = 0, xl = level[0].length; x < xl; x++) {
        if(Math.abs((x*32) + (camera.x-cw/2)) < 275) {
            for (var y = 0, yl = level.length; y < yl; y++) {
                var tile = level[y][x];
                if(tile === "air") {
                    rect(x*32,y*32,32,32,"#00aaaa");
                } else if(tile === "pipe") {
                    rect(x*32,y*32,32,32,"#00aaaa");
                    var north = level[y-1][x];
                    var south = level[y+1][x];
                    var east = level[y][x+1];
                    var west = level[y][x-1];
                    var spriteName = "";

                    if(south == "pipe" && east == "pipe") { spriteName = "pipeTopL";}
                    if(south == "pipe" && west == "pipe") { spriteName = "pipeTopR";}
                    if(north == "pipe" && east == "pipe") { spriteName = "pipeBottomL";}
                    if(north == "pipe" && west == "pipe") { spriteName = "pipeBottomR";}

                    img(sprites[spriteName],x*32,y*32,0,2,2);
                } else if(tile === "question") {
                    img(sprites[tile+(Math.round(qBlink) % 3)],x*32,y*32,0,2,2);
                } else {
                    img(sprites[tile],x*32,y*32,0,2,2);
                }
            }
        }
    }
    mario.draw();
    qBlink+=0.05;
}

function absoluteDraw() {

}

function onAssetsLoaded() {
    loadMario();
    loadTiles();
    loadLevels();
    cameraX = cw/2;
}

setup(45);