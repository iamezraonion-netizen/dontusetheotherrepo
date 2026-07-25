function drawRadar(){

    const size = 210;

    const x = canvas.width - size - 25;
    const y = 25;

    const range = 900;   // world units shown

    // ==========================
    // Background
    // ==========================

    ctx.save();

    ctx.fillStyle = "rgba(5,15,30,0.78)";

    const c = 14;

    ctx.beginPath();

    ctx.moveTo(x+c,y);
    ctx.lineTo(x+size-c,y);
    ctx.lineTo(x+size,y+c);
    ctx.lineTo(x+size,y+size-c);
    ctx.lineTo(x+size-c,y+size);
    ctx.lineTo(x+c,y+size);
    ctx.lineTo(x,y+size-c);
    ctx.lineTo(x,y+c);

    ctx.closePath();
    ctx.fill();

    ctx.shadowColor="#00d8ff";
    ctx.shadowBlur=12;

    ctx.strokeStyle="#00d8ff";
    ctx.lineWidth=2;
    ctx.stroke();

    ctx.shadowBlur=0;

    // Clip everything inside
    ctx.beginPath();
    ctx.rect(x,y,size,size);
    ctx.clip();

    const centreX = x + size/2;
    const centreY = y + size/2;
    function radarPos(wx, wy){

        return {

            x: centreX + (wx-player.x)/range*105,
            y: centreY + (wy-player.y)/range*105

        };

    }

    ctx.strokeStyle="rgba(0,220,255,0.25)";
    ctx.lineWidth=1;

    ctx.beginPath();

    ctx.arc(centreX,centreY,40,0,Math.PI*2);
    ctx.arc(centreX,centreY,75,0,Math.PI*2);
    ctx.arc(centreX,centreY,105,0,Math.PI*2);

    ctx.moveTo(centreX, y);
    ctx.lineTo(centreX, y+size);

    ctx.moveTo(x, centreY);
    ctx.lineTo(x+size, centreY);

    ctx.stroke();

    asteroids.forEach(a=>{

        const p = radarPos(a.x,a.y);

        if(
            p.x<x ||
            p.x>x+size ||
            p.y<y ||
            p.y>y+size
        ) return;

        ctx.fillStyle = "#6f5644";

        ctx.beginPath();

        for(let i = 0; i < 8; i++){

            const ang = i * Math.PI / 4;

            // Slightly different radius for each corner
            const r = 5 + (i % 2) * 2;

            const px = p.x + Math.cos(ang) * r;
            const py = p.y + Math.sin(ang) * r;

            if(i === 0)
                ctx.moveTo(px, py);
            else
                ctx.lineTo(px, py);
        }

        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#8a6c54";
        ctx.lineWidth = 1;
        ctx.stroke();
    });
        ctx.fillStyle="#ff4444";

    pirates.forEach(p=>{

        const r=radarPos(p.x,p.y);

        if(
            r.x<x||
            r.x>x+size||
            r.y<y||
            r.y>y+size
        ) return;

        ctx.beginPath();
        ctx.arc(r.x,r.y,3,0,Math.PI*2);
        ctx.fill();

    });
        [ALPHA_BASE,BETA_BASE].forEach(base=>{

        const b=radarPos(base.x,base.y);

        if(
            b.x<x||
            b.x>x+size||
            b.y<y||
            b.y>y+size
        ) return;

        ctx.fillStyle="#66ffcc";

        ctx.beginPath();
        ctx.arc(b.x,b.y,9,0,Math.PI*2);
        ctx.fill();

    });
    ctx.save();

    ctx.translate(centreX,centreY);
    ctx.rotate(player.angle);

    ctx.fillStyle="#66bbff";

    ctx.beginPath();

    ctx.moveTo(6,0);
    ctx.lineTo(-4,-4);
    ctx.lineTo(-4,4);

    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.restore();
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

    ctx.save();

    ctx.fillStyle = "rgba(120,90,45,0.5)";
    ctx.filter = "blur(18px)";

   // Top
    blob(1.45,0.95);
    blob(2.50,0.95);

    // Upper sides
    blob(0.95,1.45);
    blob(3.05,1.45);

    // Left & Right
    blob(0.90,2.50);
    blob(3.10,2.50);

    // Bottom
    blob(1.45,3.05);
    blob(2.50,3.05);

    ctx.restore();

    function blob(sectorX, sectorY){

        ctx.beginPath();

        ctx.arc(
            x + (sectorX+0.5)*mapSize/5,
            y + (sectorY+0.5)*mapSize/5,
            mapSize*0.10,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

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