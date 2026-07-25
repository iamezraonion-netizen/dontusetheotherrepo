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

// Generate asteroids
asteroidSectors.forEach(sec=>{

    const left = sec.x * SECTOR_SIZE;
    const top = sec.y * SECTOR_SIZE;

    for(let i=0;i<40;i++){

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

function updateAsteroids(){

    asteroids.forEach(a=>{

        a.x += a.vx;
        a.y += a.vy;
        a.rotation += a.rotationSpeed;

        const left   = a.sectorX * SECTOR_SIZE;
        const right  = left + SECTOR_SIZE;
        const top    = a.sectorY * SECTOR_SIZE;
        const bottom = top + SECTOR_SIZE;

        if(a.x < left + a.radius){
            a.x = left + a.radius;
            a.vx *= -1;
        }

        if(a.x > right - a.radius){
            a.x = right - a.radius;
            a.vx *= -1;
        }

        if(a.y < top + a.radius){
            a.y = top + a.radius;
            a.vy *= -1;
        }

        if(a.y > bottom - a.radius){
            a.y = bottom - a.radius;
            a.vy *= -1;
        }

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