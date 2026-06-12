// ============================================================
//  ajax.js — Songo 237 · Version 3 Modernisée
//  Gestion AJAX et polling
// ============================================================

const API_BASE = 'php/game.php';

let myRole = null;
let gameCode = null;
let sessionId = null;
let pollInterval = null;
let state = null;

// ---- NOUVELLE PARTIE ----

async function ajaxNewGame() {
  try {
    ui.showConnecting('Création de la partie...');

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'new' }),
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.error);

    gameCode = data.code;
    myRole = PLAYERS.SOUTH; // Créateur joue Sud
    state = data.state;

    engine.state = state;
    ui.showGameCode(gameCode);
    ui.hideLobby();
    startPolling();
    ui.render(state, myRole, gameCode);
  } catch (err) {
    ui.showError('Erreur : ' + err.message);
  }
}

// ---- REJOINDRE UNE PARTIE ----

async function ajaxJoinGame(code) {
  try {
    ui.showConnecting(`Connexion à la partie ${code}...`);

    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'join', code, role: PLAYERS.NORTH }),
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.error);

    gameCode = code;
    myRole = PLAYERS.NORTH; // Qui rejoint joue Nord
    sessionId = data.session_id;
    state = data.state;

    engine.state = state;
    ui.showGameCode(gameCode);
    ui.hideLobby();
    startPolling();
    ui.render(state, myRole, gameCode);
  } catch (err) {
    ui.showError('Erreur : ' + err.message);
  }
}

// ---- JOUER UN COUP ----

async function ajaxApplyMove(pitIndex) {
  if (state.status !== GAME_STATUS.PLAYING) return;
  if (state.current !== myRole) {
    ui.showError("Ce n'est pas ton tour !");
    return;
  }

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'move',
        code: gameCode,
        pitIndex,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      ui.showError(data.error);
      return;
    }

    state = data.state;
    engine.state = state;
    ui.render(state, myRole, gameCode);
  } catch (err) {
    ui.showError('Erreur réseau : ' + err.message);
  }
}

// ---- POLLING ----

function startPolling() {
  if (pollInterval) clearInterval(pollInterval);

  pollInterval = setInterval(async () => {
    if (!gameCode || state.status !== GAME_STATUS.PLAYING) {
      clearInterval(pollInterval);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}?action=state&code=${gameCode}`);
      const data = await response.json();

      if (!data.ok) return;

      // Mettre à jour seulement si changement
      if (data.state.moveNumber !== state.moveNumber) {
        state = data.state;
        engine.state = state;
        ui.render(state, myRole, gameCode);
      }
    } catch (err) {
      // Ignorer les erreurs réseau passagères
    }
  }, GAME_CONFIG.POLLING_INTERVAL);
}

// ---- INITIALISATION ----

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-new-game')?.addEventListener('click', ajaxNewGame);
  document.getElementById('btn-join-game')?.addEventListener('click', () => {
    const code = document.getElementById('code-input')?.value?.trim().toUpperCase();
    if (code) ajaxJoinGame(code);
  });
});
