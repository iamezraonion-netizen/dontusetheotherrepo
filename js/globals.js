const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const FONT = "'Orbitron', monospace";

const WORLD_SIZE = 20000;
const SECTOR_SIZE = WORLD_SIZE / 5;

const ALPHA_BASE = {
    x:1000,
    y:WORLD_SIZE-1000,
    radius:120
};

const BETA_BASE = {
    x:WORLD_SIZE-1000,
    y:1000,
    radius:120
};

let gameState = "menu";
let showMap = false;
let docked = false;
let currentBase = null;

const pirateMissiles = [];
const playerBullets = [];
const gems = [];
const pirateRespawns = [];
const uiButtons = [];

const camera = {
    x:0,
    y:0
};

const engineParticles=[];

const laser = {
    range:240,
    target:null,
    heat:0,
    active:false
};

const player={
    x:1000,
    y:1000,

    angle:0,

    speed:0,
    maxSpeed:8,

    hp:100,
    maxHp:100,
    healRate:0.015,

    level: 1,
    xp: 0,
    renown: 0,

    gems:0,
    credits:0,

    weapons:{
        laser:false
    },
    
    ships:{

        scout:true,

            fighter:false,
            frigate:false,
            destroyer:false,
            cruiser:false,
            flagship:false

        },

    currentShip:"scout",

    cannonCooldown:0
};

const keys={};

const stars=[];

for(let i=0;i<5000;i++){

    stars.push({
        x:Math.random()*WORLD_SIZE,
        y:Math.random()*WORLD_SIZE,
        size:Math.random()*2+1
    });

}
const pirates = [];

for(let i=0;i<330;i++){

    let sx, sy;

    // Pick a random sector that isn't a base sector
    do{

        sx = Math.floor(Math.random()*5);
        sy = Math.floor(Math.random()*5);

    }while(
        (sx===0 && sy===4) ||   // Alpha sector
        (sx===4 && sy===0)      // Beta sector
    );

    const x = sx*SECTOR_SIZE + Math.random()*SECTOR_SIZE;
    const y = sy*SECTOR_SIZE + Math.random()*SECTOR_SIZE;

    pirates.push({

        x,
        y,

        homeX:sx,
        homeY:sy,

        angle:Math.random()*Math.PI*2,

        hp:20,
        cooldown:0,

        returning:false,
    });

}
const asteroids = [];



