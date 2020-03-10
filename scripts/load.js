var definitions = {
    air: [255, 255, 255],
    ground: [255, 58, 0],
    brick: [150, 85, 27],
    question: [247, 255, 0],
    pipe: [13, 255, 0],
    solidBrick: [145, 106, 71],
    coin: [195, 198, 77],
    goomba: [61, 4, 0]
}

var level = [];
/*
pipes = water *
coin = death *
gomba = block *
brick = coin *
question = brick
solidbrick = air
*/

function loadLevels() {
    var canv = document.createElement("canvas");

    canv.width = sprites["1-1"].spr.width;
    canv.height = sprites["1-1"].spr.height;

    var ctx = canv.getContext("2d");

    ctx.drawImage(sprites["1-1"].spr, 0, 0);

    var data = ctx.getImageData(0, 0, canv.width, canv.height);

    var d = data.data;
    var i = 0;
    for (var y = 0, yl = data.height; y < yl; y++) {
        level.push([]);
        for (var x = 0, xl = data.width; x < xl; x++) {
            level[y][x] = loadTile([d[i], d[i + 1], d[i + 2]],x,y);
            i += 4;
        }
    }
}

function loadTile(array,x,y) {
    var keys = Object.keys(definitions);
    for (var j = 0; j < keys.length; j++) {
        var d = definitions[keys[j]];
        if (d[0] == array[0] &&
            d[1] == array[1] &&
            d[2] == array[2]) {
            if(keys[j] === "goomba") {
                goombas.push(new Goomba(x,y));
            } else {
                return keys[j];
            }
        }
    }
    return "air";
}

var tiles = [
    ["ground", 0, 0],
    ["brick", 16, 0],
    ["question0", 384, 0],
    ["question1", 400, 0],
    ["question2", 416, 0],
    ["question3", 432, 0],
    ["coin0", 384, 16],
    ["coin1", 400, 16],
    ["coin2", 416, 16],
    ["pipeTopL", 0, 128],
    ["pipeTopR", 16, 128],
    ["pipeBottomL", 0, 144],
    ["pipeBottomR", 16, 144],
    ["pipeTopM", 176, 320],
    ["pipeBottomM", 176, 336],
    ["solidBrick", 0, 16],
    ["coinIcon", 416, 128]
    // ["coin and brick", 0, 0]
];

function loadTiles() {
    var tileImg = sprites.tiles.spr;

    var canv = document.createElement("canvas");

    canv.width = 16;
    canv.height = 16;

    var ctx = canv.getContext("2d");

    for (var i = 0; i < tiles.length; i++) {
        ctx.clearRect(0,0,16,16);
        ctx.drawImage(tileImg,tiles[i][1],tiles[i][2],16,16,0,0,16,16);
        var src = canv.toDataURL("image/png");
        var tempImg = new Image();
        tempImg.src = src;
        sprites[tiles[i][0]] = {spr:tempImg,drawLimitSize:16};
    }
}

var enemies = [
    ["goomba0", 0, 16],
    ["goomba1", 16, 16],
    ["goomba2", 32, 16]
];

function loadEnemies() {
    var tileImg = sprites.enemies.spr;

    var canv = document.createElement("canvas");

    canv.width = 16;
    canv.height = 16;

    var ctx = canv.getContext("2d");

    for (var i = 0; i < enemies.length; i++) {
        ctx.clearRect(0,0,16,16);
        ctx.drawImage(tileImg,enemies[i][1],enemies[i][2],16,16,0,0,16,16);
        var src = canv.toDataURL("image/png");
        var tempImg = new Image();
        tempImg.src = src;
        sprites[enemies[i][0]] = {spr:tempImg,drawLimitSize:16};
    }
}

var marios = [
    ["idle", 80, 34],
    ["run0", 97, 34],
    ["run1", 114, 34],
    ["run2", 131, 34],
    ["jump", 165, 34],
    ["swim0", 233, 34],
    ["swim1", 250, 34],
    ["swim2", 267, 34],
    ["swim3", 284, 34],
    ["swim4", 301, 34],
    ["dead", 182, 34]
];

function loadMario() {
    var tileImg = sprites.mario.spr;

    var canv = document.createElement("canvas");

    canv.width = 15;
    canv.height = 15;

    var ctx = canv.getContext("2d");
    for (var i = 0; i < marios.length; i++) {
        ctx.clearRect(0,0,15,15);
        ctx.drawImage(tileImg,marios[i][1],marios[i][2],15,15,0,0,15,15);
        var src = canv.toDataURL("image/png");
        var tempImg = new Image();
        tempImg.src = src;
        sprites[marios[i][0]] = {spr:tempImg,drawLimitSize:15};
    }
}