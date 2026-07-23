const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
canvas.addEventListener("click", e=>{

    if(gameState !== "menu") return;

    const w = 240;
    const h = 70;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;

    if(
        e.offsetX >= x &&
        e.offsetX <= x + w &&
        e.offsetY >= y &&
        e.offsetY <= y + h
    ){

        player.x = 1000;
        player.y = WORLD_SIZE - 1000;
        player.hp = player.maxHp;
        player.speed = 0;
        player.angle = 0;

        gameState = "playing";
    }

});
canvas.addEventListener("mousemove", e=>{

    if(gameState !== "menu"){
        canvas.style.cursor = "default";
        return;
    }

    const w = 240;
    const h = 70;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;

    if(
        e.offsetX >= x &&
        e.offsetX <= x + w &&
        e.offsetY >= y &&
        e.offsetY <= y + h
    ){
        canvas.style.cursor = "pointer";
    }else{
        canvas.style.cursor = "default";
    }

});

const WORLD_SIZE = 20000;
let gameState = "menu";   // menu or playing

const pirateMissiles = [];

const camera = {
    x:0,
    y:0
};
const engineParticles=[];

const player = {
    x:1000,
    y:1000,

    angle:0,

    speed:0,
    maxSpeed:8,

   hp:100,
   maxHp:100,
   healRate:0.015,
   gems:0
};

const keys = {};

addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);

const stars=[];

for(let i=0;i<5000;i++){

    stars.push({
        x:Math.random()*WORLD_SIZE,
        y:Math.random()*WORLD_SIZE,
        size:Math.random()*2+1
    });

}
const pirates = [];

for(let i=0;i<330;i++){

    pirates.push({

        x:Math.random()*WORLD_SIZE,
        y:Math.random()*WORLD_SIZE,

        angle:Math.random()*Math.PI*2,
        speed:1+Math.random(),

        hp:20

    });

}
function updatePirates(){

    pirates.forEach(p=>{

        let nearby = 0;
        let centerX = 0;
        let centerY = 0;

        

        // Find nearby pirates
        pirates.forEach(other=>{

            if(other===p) return;

            const dx = other.x-p.x;
            const dy = other.y-p.y;

            const dist = Math.hypot(dx,dy);

            if(dist<350){

                nearby++;

                centerX+=other.x;
                centerY+=other.y;

            }

        });

        // Chase player if nearby
        const playerDist = Math.hypot(
            player.x - p.x,
            player.y - p.y
        );

        if(playerDist < 700){

            const a = Math.atan2(
                player.y - p.y,
                player.x - p.x
            );

            p.x += Math.cos(a) * 1.5;
            p.y += Math.sin(a) * 1.5;

        }
        else if(nearby>0){

            centerX /= nearby;
            centerY /= nearby;

            const dx = centerX - p.x;
            const dy = centerY - p.y;
            const d = Math.hypot(dx,dy);

            // Only move if not already in the group
            if(d > 40){

                p.x += dx/d;
                p.y += dy/d;

            }

        }
        else{

            p.angle += (Math.random()-0.5)*0.03;

            p.x += Math.cos(p.angle);
            p.y += Math.sin(p.angle);

        }
        pirates.forEach(other=>{

        if(other===p) return;

        const dx = p.x-other.x;
        const dy = p.y-other.y;

        const dist = Math.hypot(dx,dy);

        if(dist<24 && dist>0){

            const push = (24-dist)/2;

            p.x += dx/dist*push;
            p.y += dy/dist*push;

        }

});

        
        const dxPlayer = p.x - player.x;
const dyPlayer = p.y - player.y;
const hit = Math.hypot(dxPlayer, dyPlayer);

if(hit < 28){

    // Damage player
    player.hp = Math.max(0, player.hp - 0.25);

    // Push pirate away
    const push = (28 - hit) * 0.6;

    if(hit > 0){
        p.x += (dxPlayer / hit) * push;
        p.y += (dyPlayer / hit) * push;
    }

}

        // Bounce off edges
    if(p.x<0){
    p.x=0;
    p.angle=Math.PI-p.angle;
    }

    if(p.x>WORLD_SIZE){
    p.x=WORLD_SIZE;
    p.angle=Math.PI-p.angle;
    }

    if(p.y<0){
        p.y=0;
        p.angle=-p.angle;
    }

    if(p.y>WORLD_SIZE){
        p.y=WORLD_SIZE;
        p.angle=-p.angle;
    }

        // Save nearby count
        p.groupSize=nearby+1;
        if(!p.cooldown)
    p.cooldown = 0;

if(p.cooldown>0)
    p.cooldown--;

const dx = player.x-p.x;
const dy = player.y-p.y;
const dist = Math.hypot(dx,dy);

if(
    p.groupSize>=5 &&
    dist<900 &&
    p.cooldown===0
){

    pirateMissiles.push({

        x:p.x,
        y:p.y,

        angle:Math.atan2(dy,dx),

        speed:5,

        life:400

    });

    p.cooldown=180;

}

    });

}

function update(){
    if(gameState!=="playing")
        return;
// Forward
if(keys["w"] || keys["arrowup"])
    player.speed=Math.min(player.speed+0.15,player.maxSpeed);

// Reverse
if(keys["s"] || keys["arrowdown"])
    player.speed=Math.max(player.speed-0.15,-player.maxSpeed/2);

// Turn left
if(keys["a"] || keys["arrowleft"])
    player.angle-=0.05;

// Turn right
if(keys["d"] || keys["arrowright"])
    player.angle+=0.05;

    player.x+=Math.cos(player.angle)*player.speed;
    player.y+=Math.sin(player.angle)*player.speed;

    player.speed*=0.985;

    player.x=Math.max(0,Math.min(WORLD_SIZE,player.x));
    player.y=Math.max(0,Math.min(WORLD_SIZE,player.y));

    camera.x=player.x-canvas.width/2;
    camera.y=player.y-canvas.height/2;
    updatePirates();
    updatePirateMissiles();

    if(Math.abs(player.speed)>0.2){

    engineParticles.push({

        x:player.x-Math.cos(player.angle)*22,
        y:player.y-Math.sin(player.angle)*22,

        vx:-Math.cos(player.angle)*player.speed*0.5+(Math.random()-0.5),
        vy:-Math.sin(player.angle)*player.speed*0.5+(Math.random()-0.5),

        life:25,
        size:3+Math.random()*2

    });
    
    engineParticles.forEach(p=>{

    p.x+=p.vx;
    p.y+=p.vy;

    p.life--;
    p.size*=0.95;

    });

    for(let i=engineParticles.length-1;i>=0;i--){

       if(engineParticles[i].life<=0)
        engineParticles.splice(i,1);

    }  

    }
    
    if (player.hp <= 0) {
    player.hp = player.maxHp;
    player.x = 1000;
    player.y = WORLD_SIZE - 1000;
    player.speed = 0;
    }   else if (player.hp < player.maxHp) { // Changed to else if
    // Passive regeneration
    player.hp = Math.min(
        player.maxHp,
        player.hp + player.healRate
    );
    }

}

function updatePirateMissiles(){

    pirateMissiles.forEach(m=>{

        const target=Math.atan2(
            player.y-m.y,
            player.x-m.x
        );

        let diff=target-m.angle;

        while(diff>Math.PI)
            diff-=Math.PI*2;

        while(diff<-Math.PI)
            diff+=Math.PI*2;

        m.angle+=diff*0.05;

        m.x+=Math.cos(m.angle)*m.speed;
        m.y+=Math.sin(m.angle)*m.speed;

        m.life--;

        const d=Math.hypot(
            player.x-m.x,
            player.y-m.y
        );

        if(d<25){

            player.hp = Math.max(0, player.hp - 10);

            m.life=0;

        }

    });

    pirateMissiles.splice(
        0,
        pirateMissiles.length,
        ...pirateMissiles.filter(m=>m.life>0)
    );

}

function drawPirateMissiles(){

    pirateMissiles.forEach(m=>{

        // Trail
        ctx.strokeStyle="rgba(255,170,80,0.35)";
        ctx.lineWidth=1;

        ctx.beginPath();
        ctx.moveTo(
            m.x-camera.x,
            m.y-camera.y
        );
        ctx.lineTo(
            m.x-camera.x-Math.cos(m.angle)*35,
            m.y-camera.y-Math.sin(m.angle)*35
        );
        ctx.stroke();

        ctx.save();

        ctx.translate(
            m.x-camera.x,
            m.y-camera.y
        );

        ctx.rotate(m.angle);

        ctx.strokeStyle="#ffb070";
        ctx.lineWidth=2;

        ctx.beginPath();

        ctx.moveTo(-10,0);
        ctx.lineTo(8,0);

        ctx.moveTo(8,0);
        ctx.lineTo(-1,-5);

        ctx.moveTo(8,0);
        ctx.lineTo(-1,5);

        ctx.stroke();

        ctx.restore();

    });

}

function drawPirates(){

    pirates.forEach(p=>{

        const sx=p.x-camera.x;
        const sy=p.y-camera.y;

        if(
            sx<-50||
            sy<-50||
            sx>canvas.width+50||
            sy>canvas.height+50
        ) return;

        // body
    ctx.lineWidth = 3;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ff7b7b";

    ctx.beginPath();
    ctx.arc(sx, sy, 12, 0, Math.PI * 2);
    ctx.stroke();
                

    });

}

function drawEngineParticles(){

    engineParticles.forEach(p=>{

        ctx.globalAlpha=p.life/25;

        ctx.fillStyle="#66ddff";

        ctx.beginPath();

        ctx.arc(
            p.x-camera.x,
            p.y-camera.y,
            p.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

    ctx.globalAlpha=1;

}


function drawStars(){

    ctx.fillStyle="white";

    stars.forEach(s=>{

        const sx=s.x-camera.x;
        const sy=s.y-camera.y;

        if(
            sx<-5||sy<-5||
            sx>canvas.width+5||
            sy>canvas.height+5
        ) return;

        ctx.fillRect(
            sx,
            sy,
            s.size,
            s.size
        );

    });

}

function drawBases(){

    drawBase(
        1000,
        WORLD_SIZE-1000,
        "#33ff88",
        "Alpha Base"
    );

    drawBase(
        WORLD_SIZE-1000,
        1000,
        "#4488ff",
        "Beta Base"
    );

}

function drawBase(x,y,color,name){

    const sx=x-camera.x;
    const sy=y-camera.y;

    ctx.fillStyle=color;

    ctx.beginPath();
    ctx.arc(sx,sy,120,0,Math.PI*2);
    ctx.fill();

    ctx.strokeStyle="white";
    ctx.lineWidth=6;
    ctx.stroke();

    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.textAlign="center";
    ctx.fillText(name,sx,sy+160);

}

function drawShip(){

    const sx = player.x - camera.x;
    const sy = player.y - camera.y;

    ctx.save();

    ctx.translate(sx, sy);
    ctx.rotate(player.angle);

    // Ship
    ctx.fillStyle="#66ccff";

    ctx.beginPath();
    ctx.moveTo(30,0);
    ctx.lineTo(-20,-15);
    ctx.lineTo(-10,0);
    ctx.lineTo(-20,15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // ===== HP BAR =====

    const barWidth = 44;
    const barHeight = 4;

    const hpX = sx - barWidth/2;
    const hpY = sy - 34;

    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(hpX, hpY, barWidth, barHeight);

    // Health
    ctx.fillStyle = "#44ff44";
    ctx.fillRect(
        hpX,
        hpY,
        barWidth * (player.hp / player.maxHp),
        barHeight
    );

    // Border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(hpX, hpY, barWidth, barHeight);
}

function drawHUD(){

    ctx.fillStyle="white";
    ctx.font="20px Arial";


    ctx.fillText(
        "Gems: "+player.gems,
        20,
        65
    );

}
function drawMenu(){

    ctx.fillStyle = "#020813";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "64px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "game in testing",
        canvas.width/2,
        canvas.height/2-120
    );

    // Play button
    const w = 240;
    const h = 70;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;

    ctx.fillStyle = "#3a8cff";
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(x,y,w,h);

    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("PLAY",canvas.width/2,y+47);
  

}

function draw(){

    if(gameState==="menu"){
        drawMenu();
        return;
    }

    ctx.fillStyle="#020813";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawStars();
    drawBases();
    drawPirates();
    drawPirateMissiles();
    drawEngineParticles();
    drawShip();
    drawHUD();

}
function loop(){

    update();

    draw();

    requestAnimationFrame(loop);

}

loop();