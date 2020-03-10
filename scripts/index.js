images = [
    "assets/images/",
    "1-1.png",
    "tiles.png",
    "mario.png",
    "enemies.png"
];

audio = [
    "assets/audio/",
    "Coin.wav",
    "Die.wav",
    "Jump.wav"
];

var qBlink = 0;
var cameraX;

var mario = new Mario();

var slideState = 0;
var displayText = "";
var state = "intro";
var lastState = "";

var timer;

var coins = 0;

function update() {
    var newState = false;
    if (lastState !== state) {
        newState = true;
    }
    lastState = state;
    switch (state) {
        case "intro":
            if (!newState && mousePress[0]) { 
                slideState++;
                if(slideState === 2 || slideState === 5 || slideState === 6) { state = "playing"; } 
            }
            if (slideState === 0) {
                displayText = "Rene Descartes was a french philosipher from the 17th century. In his Meditations, he explored how we aquire knowlage, and know what is real.";
            } else if (slideState === 1) {
                displayText = "Descartes abandonded all previous knowladge to arrive at his conclusions. To win this game you must do the same.";
            } else if (slideState === 2) {
                displayText = "You may think you know the truth about this world, because of your previous knowladge of mario.";
            } else if (slideState === 3) {
                displayText = "Abandon all assumptions, you cannot know the nature of this world by just sensing the substances of it.";
            } else if (slideState === 4) {
                displayText = "How do you know the goomba will kill you? Is the reality presented on your screen the truth?";
            } else if (slideState === 5) {
                displayText = "One thing is for sure, Mario jumps therefore he is";
            } else if (slideState === 6) {
                displayText = "Thanks for playing!";
            }
            break;
        case "playing":
            if (keyPress[k.p]) { paused = !paused; }
            mario.update();
            var marioXPos = ~~(mario.x * 32) + 64;
            if (marioXPos - cameraX > 0) {
                cameraX = marioXPos;
                if (cameraX > (level[0].length - 1) * 32 - cw / 2) {
                    cameraX = (level[0].length - 1) * 32 - cw / 2;
                }
            }
            if(mario.x>23 && slideState === 2) {
                state = "intro";
            }
            if(mario.x>40 && slideState === 5) {
                state = "intro";
            }
            if(mario.x>205 && slideState === 6) {
                state = "intro";
            }
            centerCameraOn(cameraX, ch / 2);
            updateGoombas();
            break;
        case "dying":
            if (newState) {
                timer = Date.now();
                mario.vel.y = -0.2;
            }
            if(Date.now() - timer > 500) {
                mario.vel.y += 0.01;
                mario.y += mario.vel.y;
            }
            if (mario.y > 16) {
                state = "dead";
            }
            break;
        case "dead":
            if (newState) {
                timer = Date.now();
            }
            if(Date.now() - timer > 2000) {
                state = "playing";
                mario = new Mario();
                cameraX = cw/2;
                coins = 0;
                level = [];
                goombas = [];
                loadLevels();
            }
            break;
    }
}

function getCollisions(tileX, tileY,goombaIndex=-1) {

    tileX = Math.round(tileX) - 1;
    tileY = Math.round(tileY) - 1;

    tileX = Math.max(0, tileX);
    tileY = Math.max(0, tileY);
    tileX = Math.min(level[0].length - 3, tileX);
    tileY = Math.min(level.length - 3, tileY);

    var collisions = [];

    for (var y = tileY; y < tileY + 3; y++) {
        for (var x = tileX; x < tileX + 3; x++) {
            var cache = level[y][x];
            if (cache !== "air" && cache !== "pipe" && cache !== "coin" && cache !== "solidBrick") {
                collisions.push({ x: x, y: y, w: 1, h: 1, type: cache});
            }
        }
    }

    var thisPoint = {x:tileX,y:tileY};
    for(var i=0;i<goombas.length;i++) {
        if(i !== goombaIndex) {
            if(dist(goombas[i],thisPoint) < 4) {
                collisions.push({ x: goombas[i].x, y: goombas[i].y, w: goombas[i].w, h: goombas[i].h, type: "goomba"});
            }
        }
    }

    return collisions;
}

function colliding(rect, collisions) {
    for (var j = 0; j < collisions.length; j++) {
        if (rectrect(rect, collisions[j])) {
            return collisions[j];
        }
    }
    return false;
}

function draw() {
    switch (state) {
        case "dying":
        case "playing":
            rect(cameraX, ch / 2, cw, ch, "#5c94fc");
            for (var x = 0, xl = level[0].length; x < xl; x++) {
                if (Math.abs((x * 32) + (camera.x - cw / 2)) < 275) {
                    for (var y = 0, yl = level.length; y < yl; y++) {
                        var tile = level[y][x];
                        if (tile !== "air") {
                            if (tile === "pipe") {
                                var north = level[y - 1][x];
                                var south = level[y + 1][x];
                                var east = level[y][x + 1];
                                var west = level[y][x - 1];
                                var spriteName = "pipeBottomM";

                                if (south === "pipe" && east === "pipe") { spriteName = "pipeTopL"; }
                                if (south === "pipe" && west === "pipe") { spriteName = "pipeTopR"; }
                                if (north === "pipe" && east === "pipe") { spriteName = "pipeBottomL"; }
                                if (north === "pipe" && west === "pipe") { spriteName = "pipeBottomR"; }
                                if (east === "pipe" && west === "pipe") { spriteName = "pipeBottomM"; }
                                if (north !== "pipe" && east === "pipe" && west === "pipe") { spriteName = "pipeTopM"; }

                                img(sprites[spriteName], x * 32, y * 32, 0, 2, 2);
                            } else if (tile === "coin" || tile === "question") {
                                img(sprites[tile + (Math.round(qBlink) % 3)], x * 32, y * 32, 0, 2, 2);
                            } else {
                                img(sprites[tile], x * 32, y * 32, 0, 2, 2);
                            }
                        }
                    }
                }
            }
            drawGoombas();
            mario.draw();

            if (Math.round(qBlink) % 3 === 0) {
                qBlink += 0.025;
            } else {
                qBlink += 0.1;
            }
            break;
    }
}

function absoluteDraw() {
    if (state === "playing") {
        img(sprites.coinIcon, 16, 16, 0, 2, 2);
        text("x" + coins, 24, 10, "white", 2);
    }
    if (state === "dead") {
        rect(cw/2,ch/2,cw,ch,"black");
        img(sprites.idle,cw/2 - 50,ch/2,0,2,2);
        text("x   unlimited",cw/2,ch/2,"white",2);
    }
    if (state === "intro") {
        text(displayText, 10, 50, "white", 4, 512);
        text("click to continue", 425, 460, 2);
    }
}

function onAssetsLoaded() {
    loadMario();
    loadTiles();
    loadEnemies();
    loadLevels();
    cameraX = cw / 2;
}

setup(60);