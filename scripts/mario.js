class Mario {
    x = 10;
    y = 0;
    w = 0.75;
    h = 1;
    vel = {x:0,y:0};
    direction = 1;
    accel = 0.01;

    walkSpeed = 0.1;
    runSpeed = 0.15;
    speed = this.walkSpeed;

    gravity = 0.02;
    terminalVelocity = 0.3;
    friction = 0.01;
    jump = -0.425;
    grounded = false;

    animCount = 0;
}

Mario.prototype.update = function() {
    var input = false;

    if(keyDown[k.x]) {
        this.speed = this.runSpeed;
    } else {
        this.speed = this.walkSpeed;
    }

    // left
    if(keyDown[k.LEFT] || keyDown[k.a]) {
        if(this.vel.x > -this.speed) {
            this.vel.x -= this.accel;
        } else {
            this.vel.x += this.accel;
        }
        input = true;
        this.direction = -1;
    }
    // right
    if(keyDown[k.RIGHT] || keyDown[k.d]) {
        if(this.vel.x < this.speed) {
            this.vel.x += this.accel;
        } else { 
            this.vel.x -= this.accel;
        }
        input = true;
        this.direction = 1;
    }

    // up
    if((keyPress[k.UP] || keyPress[k.w] || keyPress[k.SPACE]) && this.grounded) {
        this.vel.y = this.jump - Math.abs(this.vel.x)/3;
        this.grounded = false;
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
        if(keyDown[k.UP] || keyDown[k.w] || keyDown[k.SPACE]) {
            this.vel.y += this.gravity;
        } else {
            this.vel.y += this.gravity*2.5;
        }
    }

    // get collision
    var collides = getCollisions(this.x,this.y);

    // y
    this.y += this.vel.y;
    var yCol = colliding(this,collides);
    if(colliding(this,collides)) {
        if(this.vel.y > 0) {
            this.y = yCol.y - (yCol.h) - 0.01;
        } else {
            this.y = yCol.y + (yCol.h) + 0.01;
        }
        this.vel.y = 0;
        this.grounded = true;
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
            if(this.vel.x > 0) {
                this.x = xCol.x - (xCol.w) - 0.01;
            } else {
                this.x = xCol.x + (xCol.w) + 0.01;
            }
            this.vel.x = 0;
        }
    }
    this.animCount += this.vel.x*2.5;
}

Mario.prototype.draw = function() {
    // rect(this.x*32,this.y*32,this.w*32,this.h*32,"#aa0000");
    if(!this.grounded) {
        img(sprites.jump,this.x*32,this.y*32,0,2*this.direction,2);
    } else if(this.vel.x === 0 ) {
        img(sprites.idle,this.x*32,this.y*32,0,2*this.direction,2);
    } else {
        img(sprites["run" +( Math.round(Math.abs(this.animCount)) % 3)],this.x*32,this.y*32,0,2*this.direction,2);
    }
}
var mario = new Mario();