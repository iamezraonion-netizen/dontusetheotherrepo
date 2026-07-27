
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
    ctx.font=`20px ${FONT}`;
    ctx.textAlign="center";
    ctx.fillText(name,sx,sy+160);

}
function drawDock(){

    const w = 620;
    const h = 460;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;

    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x,y,w,h);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = `32px ${FONT}`;
    ctx.fillText(currentBase, canvas.width/2, y+45);

    ctx.font = "22px ";

    ctx.fillText(
        "Credits: " + formatNumber(player.credits),
        canvas.width/2,
        y+95
    );

    ctx.fillText(
        "Gems: " + formatNumber(player.gems),
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
    ctx.fillRect(x+190,y+185,230,42);

    ctx.strokeStyle="white";
    ctx.strokeRect(x+190,y+185,230,42);

    ctx.fillStyle="white";
    ctx.font=`22px ${FONT}`;

    ctx.fillText(
        "Weapons",
        canvas.width/2,
        y+213
    );

    ctx.fillStyle="#66ff66";

    ctx.fillText(
        "Press B to Sell All",
        canvas.width/2,
        y+260
    );

    ctx.fillStyle="#ff0000";

    ctx.fillText(
        "Press E to Leave",
        canvas.width/2,
        y+300
    );

}

function drawWeapons(){

    uiButtons.length = 0;

    const w = 700;
    const h = 500;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;

    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x,y,w,h);

    ctx.fillStyle = "white";
    ctx.font = `34px ${FONT}`;
    ctx.textAlign = "center";

    ctx.fillText(
        "Weapons",
        canvas.width/2,
        y+45
    );

    drawWeaponCard(
        x+40,
        y+80,
        "Laser",
        "Continuous beam",
        "FREE",
        player.weapons.laser
    );

}
function drawWeaponCard(x,y,name,description,cost,owned){

    const w = 290;
    const h = 120;


    ctx.fillStyle = "#102030";
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle = "#66ccff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x,y,w,h);

    ctx.fillStyle = "white";

    ctx.textAlign = "left";

    ctx.font = `24px ${FONT}`;
    ctx.fillText(name,x+15,y+30);

    ctx.font = `16px ${FONT}`;
    ctx.fillText(description,x+15,y+60);

    ctx.fillStyle="#ffd966";

    ctx.fillText(cost,x+15,y+95);

    // Button

    const bx=x+245;
    const by=y+38;

    uiButtons.push({

        x:bx,
        y:by,
        w:30,
        h:30,

        action:"buyLaser"

    });
    
    ctx.fillStyle=owned ? "#33aa33" : "#3a8cff";

    ctx.fillRect(bx,by,30,30);

    ctx.strokeStyle="white";
    ctx.strokeRect(bx,by,30,30);

    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.font="20px Arial";

    ctx.fillText(
        owned ? "✓" : "🛒",
        bx+15,
        by+22
    );

}