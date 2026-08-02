
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
    // Ships button

    ctx.fillStyle="#33bb88";
    ctx.fillRect(x+190,y+240,230,42);

    ctx.strokeStyle="white";
    ctx.strokeRect(x+190,y+240,230,42);

    ctx.fillStyle="white";
    ctx.font=`22px ${FONT}`;

    ctx.fillText(
        "Ships",
        canvas.width/2,
        y+268
    );
    // Sell Button

    ctx.fillStyle="#44bb44";
    ctx.fillRect(x+190, y+295, 230, 42);

    ctx.strokeStyle="white";
    ctx.strokeRect(x+190, y+295, 230, 42);

    ctx.fillStyle="white";
    ctx.font=`22px ${FONT}`;
    ctx.fillText(
        "Sell Gems",
        canvas.width/2,
        y+323
    );

    ctx.fillStyle="#ff0000";

    ctx.fillText(
        "Press E to Leave",
        canvas.width/2,
        y+380
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
        player.weapons.laser,
        "buyLaser"
    );

    drawWeaponCard(
        x+360,
        y+80,
        "Plasma Field",
        "Damage radius",
        "100",
        player.weapons.plasma,
        "buyPlasma"
    );

    ctx.fillStyle="white";
    ctx.font=`26px ${FONT}`;
    ctx.textAlign="left";

    

    // Divider
    ctx.strokeStyle="#555";
    ctx.lineWidth=2;

    ctx.beginPath();
    ctx.moveTo(x+40,y+255);
    ctx.lineTo(x+w-40,y+255);
    ctx.stroke();

    ctx.font=`22px ${FONT}`;
    ctx.fillText("Equip Weapons",x+40,y+285);

    // ----------------------------
    // Weapon Slots
    // ----------------------------

    ctx.fillStyle = "white";
    ctx.font = `26px ${FONT}`;
    ctx.textAlign = "left";

    ctx.fillText("Weapon Slots", x+40, y+255);

    const totalSlots = currentShipSlots();

    const leftX = x + 40;
    const rightX = x + 360;

    const startY = y + 315;

    for(let i=0;i<totalSlots;i++){

        const column = i < 4 ? 0 : 1;

        const row = column == 0
            ? i
            : i - 4;

        drawWeaponSlot(
            column == 0 ? leftX : rightX,
            startY + row * 45,
            i
        );

    }

    // Close button
    ctx.fillStyle = "#aa2222";
    ctx.fillRect(x + w - 45, y + 10, 35, 35);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x + w - 45, y + 10, 35, 35);

    ctx.fillStyle = "white";
    ctx.font = `22px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText("✕", x + w - 27, y + 35);

}

function drawShips(){

    uiButtons.length = 0;

    const w=700;
    const h=500;

    const x=canvas.width/2-w/2;
    const y=canvas.height/2-h/2;

    ctx.fillStyle="rgba(0,0,0,.92)";
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle="white";
    ctx.lineWidth=2;
    ctx.strokeRect(x,y,w,h);

    // Title

    ctx.fillStyle="white";
    ctx.font=`34px ${FONT}`;
    ctx.textAlign="center";

    ctx.fillText(
        "Ships",
        canvas.width/2,
        y+45
    );

    // Close button
    ctx.fillStyle = "#aa2222";
    ctx.fillRect(x + w - 45, y + 10, 35, 35);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x + w - 45, y + 10, 35, 35);

    ctx.fillStyle = "white";
    ctx.font = `22px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText("✕", x + w - 27, y + 35);

    drawShipCard(
        x+25,
        y+75,
        "Scout",
        "scout",
        2
    );

    drawShipCard(
        x+25,
        y+170,
        "Fighter",
        "fighter",
        3
    );

    drawShipCard(
        x+25,
        y+265,
        "Frigate",
        "frigate",
        4
    );

    drawShipCard(
        x+360,
        y+75,
        "Destroyer",
        "destroyer",
        5
    );

    drawShipCard(
        x+360,
        y+170,
        "Cruiser",
        "cruiser",
        6
    );

    drawShipCard(
        x+360,
        y+265,
        "Flagship",
        "flagship",
        7
    );

}

function drawWeaponCard(
    x,
    y,
    name,
    description,
    cost,
    owned,
    action
){

    const w = 290;
    const h = 95;


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
    ctx.fillText(description,x+15,y+50);

    ctx.fillStyle="#ffd966";

    ctx.fillText(cost,x+15,y+75);

    // Button

    const bx=x+245;
    const by=y+28;

    uiButtons.push({

        x:bx,
        y:by,
        w:30,
        h:30,

        action:action

    });
    
    ctx.fillStyle=owned ? "#33aa33" : "#ffa03a";

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
function drawShipCard(x,y,title,id,slots){

    let status="";
    let color="#888888";

    if(player.ships[id]){

        if(player.currentShip==id){

            status="USING";
            color="#66ff66";

        }else{

            status="USE";
            color="#66ccff";

        }

    }else if(shipUnlocked(id)){

        status="BUY";
        color="#ffee66";

    }else{

        switch(id){

            case "fighter":
                status="Lv 3";
                break;

            case "frigate":
                status="Lv 5";
                break;

            case "destroyer":
                status="Lv 7";
                break;

            case "cruiser":
                status="Lv 10";
                break;

            case "flagship":
                status="1 Renown";
                break;

        }

    }

    // Card

    ctx.fillStyle="rgba(25,35,55,.9)";
    ctx.fillRect(x,y,300,80);

    ctx.strokeStyle="white";
    ctx.lineWidth=2;
    ctx.strokeRect(x,y,300,80);

    ctx.fillStyle="white";
    ctx.textAlign="left";
    ctx.font=`22px ${FONT}`;
    ctx.fillText(title,x+18,y+28);

    ctx.fillStyle="#88ddff";
    ctx.font=`18px ${FONT}`;
    ctx.fillText(slots+" Weapon Slots",x+18,y+55);

    // If unlocked and not scout, show shopping button

    if(status=="BUY" || status=="USE"){

        const bx=x+255;
        const by=y+24;

        uiButtons.push({

            x:bx,
            y:by,
            w:30,
            h:30,

            action:status=="BUY"
                ? "buy_"+id
                : "use_"+id

        });

        ctx.fillStyle="#ffa03a";
        ctx.fillRect(bx,by,30,30);

        ctx.strokeStyle="white";
        ctx.strokeRect(bx,by,30,30);

        ctx.fillStyle="white";
        ctx.textAlign="center";
        ctx.font="20px Arial";

        ctx.fillText(
            status=="BUY" ? "🛒" : "▶",
            bx+15,
            by+22
        );

    }else{

        ctx.fillStyle=color;
        ctx.textAlign="right";
        ctx.font=`18px ${FONT}`;

        ctx.fillText(
            status,
            x+280,
            y+45
        );

    }

    ctx.textAlign="center";

}
function openWeaponDropdown(slot,x,y){

    weaponDropdown={

        slot,
        x,
        y,

        options:availableWeapons()

    };

}
function closeWeaponDropdown(){

    weaponDropdown=null;

}
function drawWeaponSlot(x,y,slot){

    const weapon=player.weaponSlots[slot];

    ctx.fillStyle="#203040";
    ctx.fillRect(x,y,220,30);

    ctx.strokeStyle="white";
    ctx.strokeRect(x,y,220,30);

    ctx.fillStyle="white";
    ctx.font=`16px ${FONT}`;
    ctx.textAlign="left";

    ctx.fillText(

        weapon ?? "Empty",

        x+10,
        y+20

    );

    ctx.textAlign="right";

    ctx.fillText(

        "▼",

        x+205,
        y+20

    );

    uiButtons.push({

        x,
        y,

        w:220,
        h:30,

        action:"slot_"+slot

    });

}