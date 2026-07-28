// ======================================
// WINDOW RESIZE
// ======================================

window.addEventListener("resize", () => {

    canvas.width = innerWidth;
    canvas.height = innerHeight;

});

// ======================================
// MOUSE CLICK
// ======================================

canvas.addEventListener("click", e => {

    const mx = e.offsetX;
    const my = e.offsetY;

    // ==========================
    // MAIN MENU
    // ==========================

    if(gameState === "menu"){

        const w = 240;
        const h = 70;

        const x = canvas.width/2 - w/2;
        const y = canvas.height/2 - h/2;

        if(
            mx >= x &&
            mx <= x+w &&
            my >= y &&
            my <= y+h
        ){

            player.x = 1000;
            player.y = WORLD_SIZE-1000;

            player.hp = player.maxHp;
            player.speed = 0;
            player.angle = 0;

            gameState = "playing";

        }

        return;

    }

    // ==========================
    // DOCK MENUS
    // ==========================

    if(docked){

        // ---------- MAIN STATION ----------

        if(dockPage==="main"){

            const w = 620;
            const h = 460;

            const x = canvas.width/2-w/2;
            const y = canvas.height/2-h/2;

            // Weapons

            if(
                mx>=x+95 &&
                mx<=x+325 &&
                my>=y+185 &&
                my<=y+227
            ){

                dockPage="weapons";
                return;

            }

            // Ships

            if(
                mx>=x+95 &&
                mx<=x+325 &&
                my>=y+240 &&
                my<=y+282
            ){

                dockPage="ships";
                return;

            }

            // Sell Gems

            if(
                mx>=x+190 &&
                mx<=x+420 &&
                my>=y+295 &&
                my<=y+337
            ){

                if(player.gems>0){

                    player.credits += player.gems * 100;
                    player.gems = 0;

                }

                return;

            }

        }

        // ---------- WEAPONS ----------

        if(dockPage==="weapons"){

            const w=700;
            const h=500;

            const x=canvas.width/2-w/2;
            const y=canvas.height/2-h/2;

            // Close X

            if(
                mx>=x+w-45 &&
                mx<=x+w-10 &&
                my>=y+10 &&
                my<=y+45
            ){

                dockPage="main";
                return;

            }

        }

        

        

        // ---------- SHIPS ----------

        if(dockPage==="ships"){

            const w=700;
            const h=500;

            const x=canvas.width/2-w/2;
            const y=canvas.height/2-h/2;

            // Close X

            if(
                mx>=x+w-45 &&
                mx<=x+w-10 &&
                my>=y+10 &&
                my<=y+45
            ){

                dockPage="main";
                return;

            }

        }

    }

    // ==========================
    // UI BUTTONS
    // ==========================

    uiButtons.forEach(button=>{

        if(

            mx>=button.x &&
            mx<=button.x+button.w &&
            my>=button.y &&
            my<=button.y+button.h

        ){

        switch(button.action){

            case "buyLaser":

                player.weapons.laser=true;
                break;

            case "buy_fighter":
                player.ships.fighter=true;
                break;

            case "buy_frigate":
                player.ships.frigate=true;
                break;

            case "buy_destroyer":
                player.ships.destroyer=true;
                break;

            case "buy_cruiser":
                player.ships.cruiser=true;
                break;

            case "buy_flagship":
                player.ships.flagship=true;
                break;

        }

        }

    });

});

// ======================================
// MOUSE MOVE
// ======================================

canvas.addEventListener("mousemove", e=>{

    if(gameState!=="menu"){

        canvas.style.cursor="default";
        return;

    }

    const w=240;
    const h=70;

    const x=canvas.width/2-w/2;
    const y=canvas.height/2-h/2;

    if(

        e.offsetX>=x &&
        e.offsetX<=x+w &&
        e.offsetY>=y &&
        e.offsetY<=y+h

    ){

        canvas.style.cursor="pointer";

    }else{

        canvas.style.cursor="default";

    }

});

// ======================================
// KEYBOARD
// ======================================

window.addEventListener("keydown",e=>{

    const key=e.key.toLowerCase();

    // Toggle map

    if(key==="m"){

        showMap=!showMap;

    }

    // Dock

    if(key==="e"){

        if(player.inSafeZone){

            docked=!docked;

            if(docked){

                player.speed=0;

                dockPage="main";

                if(

                    Math.hypot(

                        player.x-ALPHA_BASE.x,
                        player.y-ALPHA_BASE.y

                    )<ALPHA_BASE.radius

                ){

                    currentBase="Alpha Base";

                }else{

                    currentBase="Beta Base";

                }

            }

        }

    }

});

// ======================================
// HELD KEYS
// ======================================

window.addEventListener("keydown",e=>{

    keys[e.key.toLowerCase()]=true;

});

window.addEventListener("keyup",e=>{

    keys[e.key.toLowerCase()]=false;

});