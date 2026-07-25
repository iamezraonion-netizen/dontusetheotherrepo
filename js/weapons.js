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
function updateLaser(){

    laser.target = null;
    laser.active = false;

    if(!player.weapons.laser)
        return;

    let closest = Infinity;

    // ---------- Find nearest missile ----------
    pirateMissiles.forEach(m=>{

        const d = Math.hypot(
            m.x-player.x,
            m.y-player.y
        );

        if(d<laser.range && d<closest){

            closest=d;
            laser.target=m;

        }

    });

    // ---------- Otherwise nearest pirate ----------
    if(!laser.target){

        pirates.forEach(p=>{

            const d=Math.hypot(
                p.x-player.x,
                p.y-player.y
            );

            if(d<laser.range && d<closest){

                closest=d;
                laser.target=p;

            }

        });

    }
    
    if(!laser.target)
            return;

    // Check if an asteroid blocks the laser
    for(const a of asteroids){

        if(lineIntersectsCircle(
            player.x,
            player.y,
            laser.target.x,
            laser.target.y,
            a.x,
            a.y,
            a.radius
        )){
            return; // Beam blocked
        }

    }

    

    laser.active=true;

    // continuous damage
    if(laser.target.life!==undefined){

        // missile
        laser.target.life=0;

    }else{

        // pirate
        laser.target.hp-=20/42;
        // 20 hp over ~700 ms at 60fps

    }

}
function drawLaser(){

    if(!player.weapons.laser)
        return;

    // Draw range circle

    ctx.strokeStyle="rgba(0,255,255,.25)";
    ctx.lineWidth=2;

    ctx.beginPath();
    const turretRadius = 37;

    ctx.strokeStyle = laser.active
        ? "#55ffff"
        : "rgba(85,255,255,0.25)";

    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(
        player.x-camera.x,
        player.y-camera.y,
        turretRadius,
        0,
        Math.PI*2
    );
    ctx.stroke();

    if(!laser.active)
        return;

    const tx=laser.target.x-camera.x;
    const ty=laser.target.y-camera.y;

    // Beam

    ctx.strokeStyle="#66ffff";
    ctx.lineWidth=4;

    ctx.beginPath();
    const angle = Math.atan2(
        laser.target.y-player.y,
        laser.target.x-player.x
    );

    const sx =
        player.x +
        Math.cos(angle)*37;

    const sy =
        player.y +
        Math.sin(angle)*37;
        ctx.moveTo(
            sx-camera.x,
            sy-camera.y
        );

        ctx.lineTo(
            laser.target.x-camera.x,
            laser.target.y-camera.y
        );
    ctx.lineTo(tx,ty);
    ctx.stroke();

    
}