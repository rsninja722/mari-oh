class Goomba {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = 0.875;
        this.h = 0.875;
        this.dir = -1;
        this.velY = 0;
        this.walk = 0;
    }
}

Goomba.prototype.update = function(index) {
    // gravity
    if (this.velY < 0.1) {
        this.velY += 0.01;
    } else {
        this.velY -= 0.01;
    }

    // get collision
    var collides = getCollisions(this.x, this.y, index);

    // y
    this.y += this.velY;
    var yCol = colliding(this, collides);
    if (yCol !== false) {
        if (this.velY > 0) {
            this.y = yCol.y - (yCol.h / 2) - (this.h / 2) - 0.001;
        } else {
            this.y = yCol.y + (yCol.h / 2) + (this.h / 2) + 0.001;
        }
        this.velY = 0;
    }

    // x
    this.x += 0.02 * this.dir;
    var xCol = colliding(this, collides);
    if (xCol !== false) {
        if (this.dir > 0) {
            this.x = xCol.x - (xCol.w / 2) - (this.w / 2) - 0.001 - (xCol.type === "goomba" ? 0.02 : 0);
            this.dir = -1;
        } else {
            this.x = xCol.x + (xCol.w / 2) + (this.w / 2) + 0.001 + (xCol.type === "goomba" ? 0.02 : 0);
            this.dir = 1;
        }
    }
}

Goomba.prototype.draw = function() {
    this.walk += 0.05;
    img(sprites["goomba" + (Math.round(this.walk) % 2)], this.x * 32, this.y * 32, 0, 2, 2);
}

var goombas = [];
function updateGoombas() {
    for (var i = 0; i < goombas.length; i++) {
        if (goombas[i].x - mario.x < 20) {
            goombas[i].update(i);
        }
    }
}

function drawGoombas() {
    for (var i = 0; i < goombas.length; i++) {
        goombas[i].draw();
    }
}