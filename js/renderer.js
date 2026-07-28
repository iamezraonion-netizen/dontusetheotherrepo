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


function drawMenu(){

    ctx.fillStyle = "#020813";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = `64px ${FONT}`;
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
    ctx.font = `32px ${FONT}`;
    ctx.fillText("PLAY",canvas.width/2,y+47);
  

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
    drawLaser();
    drawEngineParticles();

    drawShip();
    drawHUD();
    drawRadar();

    if(showMap)
        drawMap();

    if(docked){

        if(dockPage==="main")
            drawDock();

        if(dockPage==="weapons")
            drawWeapons();
        
        if(dockPage=="ships")
            drawShips();

    }
}
