window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
canvas.addEventListener("click", e=>{
    if(docked){

        const w = 620;
        const h = 460;

        const px = canvas.width/2 - w/2;
        const py = canvas.height/2 - h/2;

        if(dockPage==="main"){

            if(
                e.offsetX>=px+95 &&
                e.offsetX<=px+325 &&
                e.offsetY>=py+185 &&
                e.offsetY<=py+227
            ){

                dockPage="weapons";
                return;

            }

        }

    }

    if(gameState !== "menu") return;

    const w = 240;
    const h = 70;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;
    

    if(
        e.offsetX >= x &&
        e.offsetX <= x + w &&
        e.offsetY >= y &&
        e.offsetY <= y + h
    ){

        player.x = 1000;
        player.y = WORLD_SIZE - 1000;
        player.hp = player.maxHp;
        player.speed = 0;
        player.angle = 0;

        gameState = "playing";
    }

});

canvas.addEventListener("mousemove", e=>{

    if(gameState !== "menu"){
        canvas.style.cursor = "default";
        return;
    }

    const w = 240;
    const h = 70;

    const x = canvas.width/2 - w/2;
    const y = canvas.height/2 - h/2;

    if(
        e.offsetX >= x &&
        e.offsetX <= x + w &&
        e.offsetY >= y &&
        e.offsetY <= y + h
    ){
        canvas.style.cursor = "pointer";
    }else{
        canvas.style.cursor = "default";
    }

});
window.addEventListener("keydown", e=>{

    const key = e.key.toLowerCase();

    if(key==="m")
        showMap = !showMap;

    if(key==="e"){

        if(player.inSafeZone){

            docked = !docked;

            if(docked){

                player.speed = 0;

                dockPage = "main";

                if(
                    Math.hypot(
                        player.x-ALPHA_BASE.x,
                        player.y-ALPHA_BASE.y
                    ) < ALPHA_BASE.radius
                ){
                    currentBase = "Alpha Base";
                }else{
                    currentBase = "Beta Base";
                }

            }

        }

    }
    if(key==="b" && docked && player.gems > 0 && dockPage==="main"){

        player.credits += player.gems * 100;
        player.gems = 0;

    }
    
});
addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);

canvas.addEventListener("click", e=>{

    if(gameState!="playing")
        return;

    if(!docked)
        return;

    const rect=canvas.getBoundingClientRect();

    const mx=e.clientX-rect.left;
    const my=e.clientY-rect.top;

    uiButtons.forEach(button=>{

        if(

            mx>=button.x &&
            mx<=button.x+button.w &&
            my>=button.y &&
            my<=button.y+button.h

        ){

            if(button.action=="buyLaser"){

                player.weapons.laser=true;

            }

        }

    });

});