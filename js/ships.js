const SHIPS = {

    scout:{
        name:"Scout",
        unlockLevel:1,
        cost:0,
        hp:100,
        maxSpeed:8
    },

    fighter:{
        name:"Fighter",
        unlockLevel:3,
        cost:500,
        hp:120,
        maxSpeed:7.7
    },

    frigate:{
        name:"Frigate",
        unlockLevel:5,
        cost:1200,
        hp:160,
        maxSpeed:7.2
    },

    destroyer:{
        name:"Destroyer",
        unlockLevel:7,
        cost:2500,
        hp:220,
        maxSpeed:6.8
    },

    cruiser:{
        name:"Cruiser",
        unlockLevel:10,
        cost:5000,
        hp:300,
        maxSpeed:6.2
    },

    flagship:{
        name:"Flagship",
        renown:1,
        cost:0,
        hp:420,
        maxSpeed:5.9
    }

};

const SHIP_SLOTS = {

    scout:2,

    fighter:3,

    frigate:4,

    destroyer:5,

    cruiser:6,

    flagship:7

};

function currentShipSlots(){

    return SHIP_SLOTS[player.currentShip];

}

function drawCurrentShip(){

    switch(player.currentShip){

        case "fighter":
            drawFighter();
            break;

        case "frigate":
            drawFrigate();
            break;

        case "destroyer":
            drawDestroyer();
            break;

        case "cruiser":
            drawCruiser();
            break;

        case "flagship":
            drawFlagship();
            break;

        default:
            drawScout();

    }

    drawPlayerBars();

}
function setCurrentShip(ship){

    player.currentShip = ship;

    const slots = SHIP_SLOTS[ship];

    while(player.weaponSlots.length < slots){

        player.weaponSlots.push(null);

    }

    player.weaponSlots.length = slots;

}