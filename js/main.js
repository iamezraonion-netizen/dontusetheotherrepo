function update() {

    if (gameState !== "playing")
        return;

    updatePlayer();

    updatePirates();
    updatePirateMissiles();

    updateAsteroids();

    updateCannons();
    updateLaser();
    updatePlayerBullets();

    updateGems();
    updateRespawns();

}

function loop() {

    update();
    draw();

    requestAnimationFrame(loop);

}

loop();