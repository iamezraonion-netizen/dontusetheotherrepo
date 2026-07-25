function updatePlayer(){
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
    updateLaser();
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