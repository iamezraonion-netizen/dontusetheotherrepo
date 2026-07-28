const XP_TABLE = [
    200,   // Lv1 -> Lv2
    300,   // Lv2 -> Lv3
    400,   // Lv3 -> Lv4
    500,   // Lv4 -> Lv5
    600,   // Lv5 -> Lv6
    700,   // Lv6 -> Lv7
    800,   // Lv7 -> Lv8
    900,   // Lv8 -> Lv9
    1000   // Lv9 -> Lv10
];

function xpNeeded(){

    if(player.level >= 10)
        return Infinity;

    return XP_TABLE[player.level - 1];

}

function gainXP(amount){

    // Stop gaining XP after Level 10
    if(player.level >= 10)
        return;

    player.xp += amount;

    while(player.xp >= xpNeeded()){

        player.xp -= xpNeeded();

        levelUp();

    }

}

function levelUp(){

    if(player.level >= 10)
        return;

    player.level++;

    console.log("Level Up! Level " + player.level);

    // Reached max level
    if(player.level >= 10){

        player.level = 10;
        player.xp = 0;

        console.log("MAX LEVEL REACHED!");

    }

}

function shipUnlocked(ship){

    switch(ship){

        case "fighter":
            return player.level >= 3;

        case "frigate":
            return player.level >= 5;

        case "destroyer":
            return player.level >= 7;

        case "cruiser":
            return player.level >= 10;

        case "flagship":
            return player.renown >= 1;

        default:
            return true;

    }

}