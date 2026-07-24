const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
canvas.addEventListener("click", e=>{
    if(docked){

        const w = 420;
        const h = 260;

        const px = canvas.width/2 - w/2;
        const py = canvas.height/2 - h/2;

        if(dockPage==="main"){

            if(
                e.offsetX>=px+95 &&
                e.offsetX<=px+325 &&
                e.offsetY>=py+185 &&
                e.offsetY<=py+227
            ){

                dockPage="weapons";
                return;

            }

        }

    }

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
window.addEventListener("keydown", e=>{

    const key = e.key.toLowerCase();

    if(key==="m")
        showMap = !showMap;

    if(key==="e"){

        if(player.inSafeZone){

            docked = !docked;

            if(docked){

                dockPage = "main";

                if(
                    Math.hypot(
                        player.x-ALPHA_BASE.x,
                        player.y-ALPHA_BASE.y
                    ) < ALPHA_BASE.radius
                ){
                    currentBase = "Alpha Base";
                }else{
                    currentBase = "Beta Base";
                }

            }

        }

    }
    if(key==="b" && docked && player.gems > 0){

        player.credits += player.gems * 100;
        player.gems = 0;

    }
    if(key==="b" && docked && dockPage==="weapons"){

        player.weapons.laser = true;

    }
});


const WORLD_SIZE = 20000;
const SECTOR_SIZE = WORLD_SIZE / 5; // 4000
const ALPHA_BASE = {
    x:1000,
    y:WORLD_SIZE-1000,
    radius:120
};

const BETA_BASE = {
    x:WORLD_SIZE-1000,
    y:1000,
    radius:120
};
let gameState = "menu";   // menu or playing
let showMap = false;
let docked = false;
let currentBase = null;


const pirateMissiles = [];
const playerBullets = [];
const gems = [];
const pirateRespawns = [];

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

   gems:0,
   credits: 0,
   weapons:{
      laser:false
   },

   cannonCooldown: 0,
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

    let sx, sy;

    // Pick a random sector that isn't a base sector
    do{

        sx = Math.floor(Math.random()*5);
        sy = Math.floor(Math.random()*5);

    }while(
        (sx===0 && sy===4) ||   // Alpha sector
        (sx===4 && sy===0)      // Beta sector
    );

    const x = sx*SECTOR_SIZE + Math.random()*SECTOR_SIZE;
    const y = sy*SECTOR_SIZE + Math.random()*SECTOR_SIZE;

    pirates.push({

        x,
        y,

        homeX:sx,
        homeY:sy,

        angle:Math.random()*Math.PI*2,

        hp:20,
        cooldown:0,

        returning:false,
    });

}
const asteroids = [];

const asteroidSectors = [
    {x:1, y:1},
    {x:2, y:1},
    {x:3, y:1},

    {x:1, y:2},
    {x:3, y:2},

    {x:1, y:3},
    {x:2, y:3},
    {x:3, y:3}
];

asteroidSectors.forEach(sec=>{

    const left = sec.x * SECTOR_SIZE;
    const top = sec.y * SECTOR_SIZE;

    for(let i=0;i<33;i++){

        const radius = 45 + Math.random()*35;

        const points = [];
        const vertices = 8 + Math.floor(Math.random()*5);

        for(let j=0;j<vertices;j++){

            const pointAngle = j / vertices * Math.PI * 2;

            points.push({
                angle: pointAngle,
                r: radius * (0.75 + Math.random()*0.4)
            });

        }

        asteroids.push({

            x: left + Math.random()*SECTOR_SIZE,
            y: top + Math.random()*SECTOR_SIZE,

            radius,
            points,

            rotation: Math.random()*Math.PI*2,
            rotationSpeed:(Math.random()-0.5)*0.01,

            vx:(Math.random()-0.5)*0.35,
            vy:(Math.random()-0.5)*0.35,

            sectorX: sec.x,
            sectorY: sec.y

        });

    }

});
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

        // Centre of pirate's home sector
        const sectorCenterX = (p.homeX + 0.5) * SECTOR_SIZE;
        const sectorCenterY = (p.homeY + 0.5) * SECTOR_SIZE;

        // Distance from home sector centre
        const homeDist = Math.hypot(
            p.x - sectorCenterX,
            p.y - sectorCenterY
        );
        const left = p.homeX * SECTOR_SIZE;
        const right = left + SECTOR_SIZE;
        const top = p.homeY * SECTOR_SIZE;
        const bottom = top + SECTOR_SIZE;

        const insideSector =
            p.x >= left &&
            p.x <= right &&
            p.y >= top &&
            p.y <= bottom;

        // Too far away?
        if(homeDist >= 4600)
            p.returning = true;

        // Reached home?
        if(p.returning && insideSector)
            p.returning = false;

        if(!p.returning && playerDist < 700){

            // Chase player
            const a = Math.atan2(
                player.y-p.y,
                player.x-p.x
            );

            p.x += Math.cos(a) * 1.5;
            p.y += Math.sin(a) * 1.5;

        }
        else{

            if(p.returning){

                const a = Math.atan2(
                    sectorCenterY - p.y,
                    sectorCenterX - p.x
                );

                p.x += Math.cos(a) * 2.5;
                p.y += Math.sin(a) * 2.5;
            }
            else if(nearby > 0){

                centerX /= nearby;
                centerY /= nearby;

                const dx = centerX - p.x;
                const dy = centerY - p.y;
                const d = Math.hypot(dx, dy);

                if(d > 40){
                    p.x += dx / d;
                    p.y += dy / d;
                }
            }
            else{

                p.angle += (Math.random()-0.5)*0.03;

                p.x += Math.cos(p.angle);
                p.y += Math.sin(p.angle);
            }
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

    if(hit < 28 && !player.inSafeZone){

        // Damage player
        player.hp = Math.max(0, player.hp - 0.25);

        // Push pirate away
        const push = (28 - hit) * 0.6;

        if(hit > 0){
            p.x += (dxPlayer / hit) * push;
            p.y += (dyPlayer / hit) * push;
        }

    }
    // Keep pirates outside Alpha Base
    [ALPHA_BASE, BETA_BASE].forEach(base=>{

        const dx = p.x - base.x;
        const dy = p.y - base.y;

        const dist = Math.hypot(dx,dy);

        const safeRadius = base.radius + 80;

        if(dist < safeRadius && dist > 0){

            const push = safeRadius - dist;

            p.x += dx/dist * push * 0.15;
            p.y += dy/dist * push * 0.15;

        }

    });

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

        asteroids.forEach(a=>{

        const dx = p.x-a.x;
        const dy = p.y-a.y;

        const d = Math.hypot(dx,dy);

        const r = a.radius + 12;

        if(d<r && d>0){

            const push = r-d;

            p.x += dx/d*push;
            p.y += dy/d*push;

        }

    });

    });

}

function updateAsteroids(){

    asteroids.forEach(a=>{

        a.x += a.vx;
        a.y += a.vy;
        a.rotation += a.rotationSpeed;

        const left   = a.sectorX * SECTOR_SIZE;
        const right  = left + SECTOR_SIZE;
        const top    = a.sectorY * SECTOR_SIZE;
        const bottom = top + SECTOR_SIZE;

        // Bounce off LEFT/RIGHT of its own sector
        if(a.x < left + a.radius){
            a.x = left + a.radius;
            a.vx *= -1;
        }

        if(a.x > right - a.radius){
            a.x = right - a.radius;
            a.vx *= -1;
        }

        // Bounce off TOP/BOTTOM of its own sector
        if(a.y < top + a.radius){
            a.y = top + a.radius;
            a.vy *= -1;
        }

        if(a.y > bottom - a.radius){
            a.y = bottom - a.radius;
            a.vy *= -1;
        }

        // Prevent asteroids overlapping
        asteroids.forEach(other=>{

            if(other===a) return;

            const dx = a.x-other.x;
            const dy = a.y-other.y;

            const d = Math.hypot(dx,dy);
            const r = a.radius + other.radius;

            if(d<r && d>0){

                const push = (r-d)/2;

                a.x += dx/d*push;
                a.y += dy/d*push;

            }

        });

    });

}
function updateCannons(){

    if(player.cannonCooldown > 0)
        player.cannonCooldown--;

    let target = null;
    let closest = 999999;

    pirates.forEach(p=>{

        const dx = p.x - player.x;
        const dy = p.y - player.y;

        const dist = Math.hypot(dx,dy);

        if(dist > 500) return;

        const targetAngle = Math.atan2(dy,dx);

        let diff = targetAngle - player.angle;

        while(diff > Math.PI)
            diff -= Math.PI*2;

        while(diff < -Math.PI)
            diff += Math.PI*2;

        // 53 degree cone
        if(Math.abs(diff) < 0.57){

            if(dist < closest){

                closest = dist;
                target = p;

            }
        }
    });

    if(target && player.cannonCooldown===0){

        const shootAngle = Math.atan2(
            target.y-player.y,
            target.x-player.x
        );

        playerBullets.push({

            x:player.x + Math.cos(shootAngle)*30,
            y:player.y + Math.sin(shootAngle)*30,

            angle:shootAngle,

            speed:12,
            life:60

        });

        player.cannonCooldown = 12;
    }
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
    updateAsteroids();
    updateCannons();
    updatePlayerBullets();
    updateGems();
    updateRespawns();

    asteroids.forEach(a=>{

        const dx = player.x-a.x;
        const dy = player.y-a.y;

        const d = Math.hypot(dx,dy);

        const r = a.radius + 20;

        if(d<r && d>0){

            const push = r-d;

            player.x += dx/d*push;
            player.y += dy/d*push;

        }

    });

    if(Math.abs(player.speed)>0.2){

        engineParticles.push({

            x:player.x-Math.cos(player.angle)*22,
            y:player.y-Math.sin(player.angle)*22,

            vx:-Math.cos(player.angle)*player.speed*0.5+(Math.random()-0.5),
            vy:-Math.sin(player.angle)*player.speed*0.5+(Math.random()-0.5),

            life:25,
            size:3+Math.random()*2

        });

    }
    // Update engine particles
    engineParticles.forEach(p=>{

        p.x += p.vx;
        p.y += p.vy;

        p.life--;
        p.size *= 0.95;

    });

    // Remove dead particles
    for(let i=engineParticles.length-1;i>=0;i--){

        if(engineParticles[i].life<=0)
            engineParticles.splice(i,1);

    }
    
    if (player.hp <= 0) {
    player.hp = player.maxHp;
    dropPlayerGems();
    player.x = ALPHA_BASE.x;
    player.y = ALPHA_BASE.y;
    player.speed = 0;
    }   else if (player.hp < player.maxHp) { // Changed to else if
    // Passive regeneration
    player.hp = Math.min(
        player.maxHp,
        player.hp + player.healRate
    );
    }
    player.inSafeZone = false;

    [ALPHA_BASE, BETA_BASE].forEach(base=>{

        const d = Math.hypot(
            player.x - base.x,
            player.y - base.y
        );

        if(d < base.radius){

            player.inSafeZone = true;

        }

    });
    if(!player.inSafeZone){

        docked = false;
        currentBase = null;

    }

}
function updatePlayerBullets(){

    playerBullets.forEach(b=>{

        b.x += Math.cos(b.angle)*b.speed;
        b.y += Math.sin(b.angle)*b.speed;

        
        asteroids.forEach(a=>{

        const d = Math.hypot(
            b.x-a.x,
            b.y-a.y
        );

        if(d < a.radius){

            b.life = 0;

        }

    });

        pirates.forEach(p=>{

            const d = Math.hypot(
                p.x-b.x,
                p.y-b.y
            );

            if(d < 15){

                p.hp -= 10;

                b.life = 0;
            }

        });

    });

    // Remove dead pirates
    for(let i=pirates.length-1;i>=0;i--){

        if(pirates[i].hp<=0){

            // Drop a gem
            gems.push({

                x: pirates[i].x,
                y: pirates[i].y,

                size: 6,
                pulse: Math.random() * Math.PI * 2

            });

            // Schedule pirate respawn
            pirateRespawns.push({
                timer:360    // 6 seconds
            });

            // Remove pirate
            pirates.splice(i,1);
        }
    }

    // Remove bullets
    for(let i=playerBullets.length-1;i>=0;i--){

        if(playerBullets[i].life<=0)
            playerBullets.splice(i,1);
    }
}
function updateRespawns(){

    for(let i=pirateRespawns.length-1;i>=0;i--){

        pirateRespawns[i].timer--;

        if(pirateRespawns[i].timer <= 0){

            let sx, sy;

            do{

                sx = Math.floor(Math.random()*5);
                sy = Math.floor(Math.random()*5);

            }while(
                (sx===0 && sy===4) ||
                (sx===4 && sy===0)
            );

            const x = sx*SECTOR_SIZE + Math.random()*SECTOR_SIZE;
            const y = sy*SECTOR_SIZE + Math.random()*SECTOR_SIZE;

            pirates.push({

                x,
                y,

                homeX:sx,
                homeY:sy,

                angle:Math.random()*Math.PI*2,

                hp:20,
                cooldown:0,
                returning: false

            });

            pirateRespawns.splice(i,1);

        }
    }

}
function dropPlayerGems(){

    for(let i=0;i<player.gems;i++){

        const angle = Math.random()*Math.PI*2;
        const dist = Math.random()*35;

        gems.push({

            x: player.x + Math.cos(angle)*dist,
            y: player.y + Math.sin(angle)*dist,

            size:6,
            pulse:Math.random()*Math.PI*2

        });

    }

    player.gems = 0;

}

function updatePirateMissiles(){

    pirateMissiles.forEach(m=>{

        // Home towards player
        const target = Math.atan2(
            player.y - m.y,
            player.x - m.x
        );

        let diff = target - m.angle;

        while(diff > Math.PI)
            diff -= Math.PI * 2;

        while(diff < -Math.PI)
            diff += Math.PI * 2;

        m.angle += diff * 0.05;

        // Move
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        m.life--;

        asteroids.forEach(a=>{

            const d = Math.hypot(
                m.x-a.x,
                m.y-a.y
            );

            if(d < a.radius){

                m.life = 0;

            }

        });

        // Hit player (only outside safe zone)
        const d = Math.hypot(
            player.x - m.x,
            player.y - m.y
        );

        if(d < 25 && !player.inSafeZone){

            player.hp = Math.max(0, player.hp - 10);
            m.life = 0;

        }

        // Destroy missile if it enters either base
        [ALPHA_BASE, BETA_BASE].forEach(base=>{

            const bd = Math.hypot(
                m.x - base.x,
                m.y - base.y
            );

            if(bd < base.radius){

                m.life = 0;

            }

        });

    });

    // Remove dead missiles
    pirateMissiles.splice(
        0,
        pirateMissiles.length,
        ...pirateMissiles.filter(m => m.life > 0)
    );

}
function updateGems(){

    for(let i=gems.length-1;i>=0;i--){

        const g = gems[i];

        const d = Math.hypot(
            player.x-g.x,
            player.y-g.y
        );

        if(d<30){

            player.gems++;

            gems.splice(i,1);

        }

    }

}
function drawGems(){

        gems.forEach(g=>{

            const sx = g.x - camera.x;
            const sy = g.y - camera.y;

            if(
                sx < -20 ||
                sy < -20 ||
                sx > canvas.width+20 ||
                sy > canvas.height+20
            ) return;

            g.pulse += 0.08;

            const r = g.size + Math.sin(g.pulse)*1;

            ctx.save();

            ctx.translate(sx,sy);
            ctx.rotate(g.pulse*0.5);

            ctx.fillStyle="#fff700";

            ctx.beginPath();
            ctx.moveTo(0,-r);
            ctx.lineTo(r*0.7,0);
            ctx.lineTo(0,r);
            ctx.lineTo(-r*0.7,0);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

        });

    }
    function drawWeapons(){

        const w=420;
        const h=260;

        const x=canvas.width/2-w/2;
        const y=canvas.height/2-h/2;

        ctx.fillStyle="rgba(0,0,0,.9)";
        ctx.fillRect(x,y,w,h);

        ctx.strokeStyle="white";
        ctx.lineWidth=2;
        ctx.strokeRect(x,y,w,h);

        ctx.fillStyle="white";
        ctx.textAlign="center";

        ctx.font="30px Arial";
        ctx.fillText("Weapons",canvas.width/2,y+40);

        ctx.font="24px Arial";

        ctx.fillText(
            "Laser",
            canvas.width/2,
            y+95
        );

        ctx.fillText(
            "Cost: FREE",
            canvas.width/2,
            y+130
        );

        ctx.fillStyle=
            player.weapons.laser
            ? "#66ff66"
            : "white";

        ctx.fillText(
            player.weapons.laser
            ? "OWNED"
            : "Press B to Buy",
            canvas.width/2,
            y+185
        );

        ctx.fillStyle="#ff6666";

        ctx.fillText(
            "Press E to Return",
            canvas.width/2,
            y+230
        );

    }
    function drawAsteroids(){

    asteroids.forEach(a=>{

        const sx = a.x-camera.x;
        const sy = a.y-camera.y;

        if(
            sx<-100||
            sy<-100||
            sx>canvas.width+100||
            sy>canvas.height+100
        ) return;

        ctx.fillStyle = "#5a4738";

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(a.rotation);

        ctx.beginPath();

        a.points.forEach((p,i)=>{

            const px = Math.cos(p.angle) * p.r;
            const py = Math.sin(p.angle) * p.r;
            if(i===0)
                ctx.moveTo(px,py);
            else
                ctx.lineTo(px,py);

        });

        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle="#7d624c";
        ctx.lineWidth=4;
        ctx.stroke();
        ctx.restore();

    });

}
function drawDock(){

    const w = 420;
    const h = 260;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;

    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x,y,w,h);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "32px Arial";
    ctx.fillText(currentBase, canvas.width/2, y+45);

    ctx.font = "22px Arial";

    ctx.fillText(
        "Credits: " + player.credits,
        canvas.width/2,
        y+95
    );

    ctx.fillText(
        "Gems: " + player.gems,
        canvas.width/2,
        y+130
    );

    ctx.fillText(
        "1 Gem = 100 Credits",
        canvas.width/2,
        y+170
    );
    // Weapons button

    ctx.fillStyle="#3366ff";
    ctx.fillRect(x+95,y+185,230,42);

    ctx.strokeStyle="white";
    ctx.strokeRect(x+95,y+185,230,42);

    ctx.fillStyle="white";
    ctx.font="22px Arial";

    ctx.fillText(
        "Weapons",
        canvas.width/2,
        y+213
    );

    ctx.fillStyle="#66ff66";

    ctx.fillText(
        "Press B to Sell All",
        canvas.width/2,
        y+250
    );

    ctx.fillStyle="#ff0000";

    ctx.fillText(
        "Press E to Leave",
        canvas.width/2,
        y+240
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
function drawPlayerBullets(){

    playerBullets.forEach(b=>{

        ctx.strokeStyle="#66bbff";
        ctx.lineWidth=5;

        ctx.beginPath();

        ctx.moveTo(
            b.x-camera.x,
            b.y-camera.y
        );

        ctx.lineTo(
            b.x-camera.x-Math.cos(b.angle)*18,
            b.y-camera.y-Math.sin(b.angle)*18
        );

        ctx.stroke();

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
        90,
        65
    );
    ctx.fillText(
        "Credits: " + player.credits,
        90,
        95
    );
    if(player.inSafeZone){

        ctx.fillStyle = "#66ff66";
        ctx.font = "26px Arial";

        ctx.fillText(
            "SAFE ZONE",
            765,
            125
        );

    }

}
function drawMap(){

    const mapSize = 320;

    const x = canvas.width/2 - mapSize/2;
    const y = canvas.height/2 - mapSize/2;

    // Background
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(x,y,mapSize,mapSize);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x,y,mapSize,mapSize);

    // Convert world coordinates to map coordinates
    function mapX(wx){
        return x + wx/WORLD_SIZE*mapSize;
    }

    function mapY(wy){
        return y + wy/WORLD_SIZE*mapSize;
    }

    // Alpha Base
    ctx.fillStyle = "#33ff88";

    ctx.beginPath();
    ctx.arc(
        mapX(1000),
        mapY(WORLD_SIZE-1000),
        9,
        0,
        Math.PI*2
    );
    ctx.fill();
    // Beta Base
    ctx.fillStyle = "#4488ff";

    ctx.beginPath();
    ctx.arc(
        mapX(WORLD_SIZE - 1000),
        mapY(1000),
        8,
        0,
        Math.PI * 2
    );
    ctx.fill();

   // Player (triangle)
    const px = mapX(player.x);
    const py = mapY(player.y);

    ctx.save();

    ctx.translate(px, py);
    ctx.rotate(player.angle);

    ctx.fillStyle = "#66bbff";

    ctx.beginPath();
    ctx.moveTo(5, 0);     // nose
    ctx.lineTo(-3, -3);
    ctx.lineTo(-3, 3);
    ctx.closePath();

    ctx.fill();

    ctx.restore();

    // Pirates within radar range
    ctx.fillStyle = "#ff4444";

    pirates.forEach(p=>{


        ctx.beginPath();
        ctx.arc(
            mapX(p.x),
            mapY(p.y),
            2,      // 4px diameter
            0,
            Math.PI*2
        );
        ctx.fill();

    });

}
function drawMenu(){

    ctx.fillStyle = "#020813";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "64px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "game in testing and still under construction",
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
    drawAsteroids();
    drawBases();

    drawPirates();   
    drawGems();       
    drawPirateMissiles();
    drawPlayerBullets();
    drawEngineParticles();

    drawShip();
    drawHUD();


    if(showMap)
        drawMap();

    if(docked){

        if(dockPage==="main")
            drawDock();

        if(dockPage==="weapons")
            drawWeapons();

    }

}

function loop(){

    update();

    draw();

    requestAnimationFrame(loop);

}

loop();