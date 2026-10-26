const MAX_HP = 100;
const HERO_MIN_ATK = 8;
const HERO_MAX_ATK = 15;
const ENEMY_MIN_ATK = 5;
const ENEMY_MAX_ATK = 14;
const HEAL_AMOUNT = 20;
const MAX_HEALS = 3;
const CRIT_CHANCE = 0.10;

let gameState = {
    heroHp: MAX_HP,
    enemyHp: MAX_HP,
    healsLeft: MAX_HEALS,
    isDefending: false,
    gameOver: false,
    actionLog: []
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logAction(message) {
    gameState.actionLog.unshift(message);
    if (gameState.actionLog.length > 5) {
        gameState.actionLog.pop();
    }
    updateGameUI();
}

function updateGameUI() {
    document.getElementById("hero-hp").textContent = gameState.heroHp;
    document.getElementById("enemy-hp").textContent = gameState.enemyHp;
    document.getElementById("heals-left").textContent = gameState.healsLeft;
    
    const logBox = document.getElementById("game-log");
    logBox.textContent = gameState.actionLog.join("\n");
}

function heroAttack() {
    if (gameState.gameOver) return;
    
    let dmg = getRandomInt(HERO_MIN_ATK, HERO_MAX_ATK);
    let isCrit = Math.random() < CRIT_CHANCE;
    if (isCrit) dmg *= 2;
    
    gameState.enemyHp = Math.max(0, gameState.enemyHp - dmg);
    logAction(`Hero attacks enemy for ${dmg} damage${isCrit ? ' (CRITICAL!)' : ''}.`);
    
    checkWinLoss();
    if (!gameState.gameOver) enemyTurn();
}

function heroDefend() {
    if (gameState.gameOver) return;
    
    gameState.isDefending = true;
    logAction(`Hero takes a defensive stance, halving incoming damage.`);
    
    enemyTurn();
}

function heroHeal() {
    if (gameState.gameOver) return;
    
    if (gameState.healsLeft <= 0) {
        alert("No heals left!");
        return;
    }
    if (gameState.heroHp === MAX_HP) {
        alert("HP is already full!");
        return;
    }
    
    gameState.heroHp = Math.min(MAX_HP, gameState.heroHp + HEAL_AMOUNT);
    gameState.healsLeft--;
    logAction(`Hero heals for ${HEAL_AMOUNT} HP. Heals remaining: ${gameState.healsLeft}`);
    
    enemyTurn();
}

function enemyTurn() {
    let dmg = getRandomInt(ENEMY_MIN_ATK, ENEMY_MAX_ATK);
    
    if (gameState.isDefending) {
        dmg = Math.floor(dmg / 2);
        gameState.isDefending = false;
        logAction(`Enemy attacks, but hero's defense halves it to ${dmg} damage.`);
    } else {
        logAction(`Enemy attacks hero for ${dmg} damage.`);
    }
    
    gameState.heroHp = Math.max(0, gameState.heroHp - dmg);
    checkWinLoss();
}

function checkWinLoss() {
    if (gameState.enemyHp === 0 && gameState.heroHp === 0) {
        gameState.gameOver = true;
        logAction(`It's a draw!`);
    } else if (gameState.enemyHp === 0) {
        gameState.gameOver = true;
        logAction(`Victory! Hero defeated the enemy.`);
    } else if (gameState.heroHp === 0) {
        gameState.gameOver = true;
        logAction(`Defeat! Enemy defeated the hero.`);
    }
}

function restartGame() {
    gameState = {
        heroHp: MAX_HP,
        enemyHp: MAX_HP,
        healsLeft: MAX_HEALS,
        isDefending: false,
        gameOver: false,
        actionLog: []
    };
    logAction("Game restarted. Choose your action!");
}

document.getElementById("btn-attack").addEventListener("click", heroAttack);
document.getElementById("btn-defend").addEventListener("click", heroDefend);
document.getElementById("btn-heal").addEventListener("click", heroHeal);
document.getElementById("btn-restart").addEventListener("click", restartGame);
logAction("Battle started!");