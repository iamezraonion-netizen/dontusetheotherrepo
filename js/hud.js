function drawHUD(){

    const panelX = 20;
    const panelY = 20;
    const panelW = 250;
    const panelH = 160;

    ctx.fillStyle = "rgba(5,15,30,0.75)";

    // Panel shape
    const c = 12;

    ctx.beginPath();

    ctx.moveTo(panelX+c,panelY);
    ctx.lineTo(panelX+panelW-c,panelY);
    ctx.lineTo(panelX+panelW,panelY+c);
    ctx.lineTo(panelX+panelW,panelY+panelH-c);
    ctx.lineTo(panelX+panelW-c,panelY+panelH);
    ctx.lineTo(panelX+c,panelY+panelH);
    ctx.lineTo(panelX,panelY+panelH-c);
    ctx.lineTo(panelX,panelY+c);

    ctx.closePath();

    ctx.fill();

    // Glow
    ctx.shadowColor="#00d8ff";
    ctx.shadowBlur=12;

    ctx.strokeStyle="#00d8ff";
    ctx.lineWidth=2;
    ctx.stroke();

    ctx.shadowBlur=0;

    // Text
    ctx.fillStyle="#bfefff";
    ctx.textAlign="left";
    ctx.font=`20px ${FONT}`;

    ctx.fillStyle = "#ffd93b";

    ctx.beginPath();
    ctx.moveTo(panelX+12,panelY+27);
    ctx.lineTo(panelX+18,panelY+18);
    ctx.lineTo(panelX+24,panelY+27);
    ctx.lineTo(panelX+18,panelY+36);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle="#fff6b0";
    ctx.lineWidth=1.5;
    ctx.stroke();

    ctx.fillText(
        "GEMS: " + formatNumber(player.gems),
        panelX+35,
        panelY+35
    );

    ctx.strokeStyle="#00d8ff";
    ctx.lineWidth=2;

    ctx.beginPath();
    ctx.roundRect(panelX+10,panelY+52,16,16,3);
    ctx.stroke();

    ctx.fillStyle="#00d8ff";
    ctx.font=`13px ${FONT}`;
    ctx.textAlign="center";

    ctx.fillText(
        "C",
        panelX+18,
        panelY+64
    );

    // Restore settings
    ctx.textAlign="left";
    ctx.font=`20px ${FONT}`;

    ctx.fillText(
        "CREDITS: " + formatNumber(player.credits),
        panelX+35,
        panelY+70
    );

    ctx.fillStyle = "#8fe8ff";
    ctx.font = `18px ${FONT}`;

    ctx.fillText(
        "LEVEL: " + player.level,
        panelX + 10,
        panelY + 100
    );

    if(player.level < 10){

        ctx.fillText(
            "XP: " + player.xp + " / " + xpNeeded(),
            panelX + 10,
            panelY + 125
        );

    }else{

        ctx.fillText(
            "XP: MAX",
            panelX + 10,
            panelY + 125
        );

    }

    const barX = panelX + 10;
    const barY = panelY + 135;
    const barW = 220;
    const barH = 12;

    ctx.fillStyle = "#222";
    ctx.fillRect(barX, barY, barW, barH);

    let percent = 1;

    if(player.level < 10){

        percent = player.xp / xpNeeded();

    }

    ctx.fillStyle = "#55bbff";
    ctx.fillRect(
        barX,
        barY,
        barW * percent,
        barH
    );

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(
        barX,
        barY,
        barW,
        barH
    );
   ctx.textAlign = "center";

    if(player.inSafeZone){

        ctx.fillStyle = "#66ff66";
        ctx.font = `26px ${FONT}`;

        ctx.fillText(
            "STATION PERIMETER",
            canvas.width / 2,
            125
        );

    }

    if(player.inSafeZone){

        ctx.fillStyle = "white";
        ctx.font = `20px ${FONT}`;

        ctx.fillText(
            "Press E to dock",
            canvas.width / 2,
            160
        );

    }
}
