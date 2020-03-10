class Mario {
    constructor() {
        this.x = 4;
        this.y = 14;
        this.w = 0.75;
        this.h = 1;
        this.vel = {x:0,y:0};
        this.direction = 1;
        this.accel = 0.002;

        this.walkSpeed = 0.1;
        this.runSpeed = 0.2;
        this.speed = this.walkSpeed;

        this.gravity = 0.02;
        this.terminalVelocity = 0.4;
        this.friction = 0.01;
        this.jump = -0.225;
        this.grounded = false;
        this.swimming = true;

        this.animCount = 0;
    }
}

Mario.prototype.update = function() {
    this.swimming = false;
    var blockOn = level[Math.round(this.y)][Math.round(this.x)];
    if(blockOn === "pipe") {
        this.swimming = true;
    }
    if(blockOn === "coin") {
        state = "dying";
    }
    var input = false;

    if(keyDown[k.x]) {
        this.speed = this.runSpeed;
    } else {
        this.speed = this.walkSpeed;
    }

    // left
    if(keyDown[k.LEFT] || keyDown[k.a]) {
        if(this.vel.x > -this.speed * (this.swimming ? 0.3 : 1)) {
            this.vel.x -= this.accel;
        } else {
            this.vel.x += this.accel;
        }
        input = true;
        this.direction = -1;
    }
    // right
    if(keyDown[k.RIGHT] || keyDown[k.d]) {
        if(this.vel.x < this.speed * (this.swimming ? 0.3 : 1)) {
            this.vel.x += this.accel;
        } else { 
            this.vel.x -= this.accel;
        }
        input = true;
        this.direction = 1;
    }

    // up
    if(keyPress[k.UP] || keyPress[k.w] || keyPress[k.SPACE] ) {
        if(this.swimming) {
            this.vel.y = -0.1;
        } else if(this.grounded) {
            this.vel.y = this.jump - Math.abs(this.vel.x)/3;
            this.grounded = false;
        }
    }

    // friction
    if(!input) {
        if(this.vel.x>0) {
            this.vel.x -= this.friction;
        }
        if(this.vel.x<0) {
            this.vel.x += this.friction;
        }
        if(Math.abs(this.vel.x) < this.friction * 2) {
            this.vel.x = 0;
        }
    }

    // gravity
    if(this.vel.y < this.terminalVelocity) {
        if(this.swimming) {
            if(this.vel.y < 0.1) {
                this.vel.y += 0.005;
            } else {
                this.vel.y -= 0.05;
            }
        } else if(keyDown[k.UP] || keyDown[k.w] || keyDown[k.SPACE]) {
            this.vel.y += this.gravity/2.75;
        } else {
            this.vel.y += this.gravity;
        }
    }

    // get collision
    var collides = getCollisions(this.x,this.y);
    // y
    this.y += this.vel.y;
    var yCol = colliding(this,collides);
    if(yCol !== false) {
        if(yCol.type === "brick") {
            level[yCol.y][yCol.x] = "air";
            coins++;
        } else {
            if(this.vel.y > 0) {
                this.y = yCol.y - (yCol.h/2) - (this.h/2) - 0.001;
            } else {
                this.y = yCol.y + (yCol.h/2) + (this.h/2) + 0.001;
            }
            this.vel.y = 0;
            this.grounded = true;
        }
    } else {
        this.grounded = false;
    }

    // x
    this.x += this.vel.x;
    
    if(this.x*32 - this.w*16 <= cameraX - cw/2) {
        this.x -= this.vel.x;
        this.vel.x = 0;
    } else {
        var xCol = colliding(this,collides);
        if( xCol !== false) {
            if(xCol.type === "brick") {
                if(level[xCol.y][xCol.x] !== "air") {
                    level[xCol.y][xCol.x] = "air";
                    coins++;
                }
            } else {
                if(this.x < xCol.x) {
                    this.x = xCol.x - (xCol.w/2) - (this.w/2) - 0.001 - (xCol.type === "goomba" ? 0.02 : 0);
                } else {
                    this.x = xCol.x + (xCol.w/2) + (this.w/2) + 0.001 + (xCol.type === "goomba" ? 0.02 : 0);
                }
                this.vel.x = 0;
            }
        }
    }

    if(this.swimming) {
        this.animCount += 0.1;
    } else {
        this.animCount += this.vel.x*2;
    }
}

Mario.prototype.draw = function() {
    // rect(this.x*32,this.y*32,this.w*32,this.h*32,"#aa0000");
    if(state === "dying") {
        img(sprites.dead,this.x*32,this.y*32,0,2,2);
    } else if(this.swimming) {
        if(this.vel.x === 0 && this.vel.y > 0) {
            img(sprites["swim" +( Math.round(Math.abs(this.animCount)) % 2)],this.x*32,this.y*32,0,2*this.direction,2);
        } else {
            img(sprites["swim" +( Math.round(Math.abs(this.animCount)) % 5)],this.x*32,this.y*32,0,2*this.direction,2);
        }
    } else if(!this.grounded) {
        img(sprites.jump,this.x*32,this.y*32,0,2*this.direction,2);
    } else if(this.vel.x === 0 ) {
        img(sprites.idle,this.x*32,this.y*32,0,2*this.direction,2);
    } else {
        img(sprites["run" +( Math.round(Math.abs(this.animCount)) % 3)],this.x*32,this.y*32,0,2*this.direction,2);
    }
}