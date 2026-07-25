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