
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

        ctx.font=`30px ${FONT}`;
        ctx.fillText("Weapons",canvas.width/2,y+40);

        ctx.font=`24px ${FONT}`;

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