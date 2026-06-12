// ============================================================
//  constants.js — Songo 237 · Version 3 Modernisée
//  Constantes centralisées du jeu
// ============================================================

// Configuration du jeu
const GAME_CONFIG = {
  PITS: 7,              // Nombre de cases par joueur
  INIT_SEEDS: 5,        // Graines par case au démarrage
  TOTAL_SEEDS: 70,      // Invariant absolu
  WIN_SCORE: 40,        // Score pour gagner
  LOW_BOARD: 10,        // Fin de partie si < 10 graines
  CAPTURE_VALUES: [2, 3, 4], // Valeurs capturables
  POLLING_INTERVAL: 2000, // Millisecondes
};

// Directions de jeu (sens des aiguilles d'une montre)
const DIRECTIONS = {
  CLOCKWISE: 'clockwise',
};

// États de la partie
const GAME_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  ENDED: 'ended',
};

// Raisons de fin de partie
const END_REASONS = {
  SCORE_40: 'score_40',
  LOW_BOARD: 'low_board',
  NO_LEGAL_MOVE: 'no_legal_move',
};

// Joueurs
const PLAYERS = {
  NORTH: 'north',
  SOUTH: 'south',
};

// Cycle de semaille complet (clockwise)
function createCycle() {
  const cycle = [];
  // Nord : N0 → N1 → N2 → N3 → N4 → N5 → N6
  for (let i = 0; i < GAME_CONFIG.PITS; i++) {
    cycle.push({ player: PLAYERS.NORTH, index: i });
  }
  // Sud : S6 → S5 → S4 → S3 → S2 → S1 → S0
  for (let i = GAME_CONFIG.PITS - 1; i >= 0; i--) {
    cycle.push({ player: PLAYERS.SOUTH, index: i });
  }
  return cycle;
}

const CYCLE = createCycle();

// Messages d'erreur
const ERROR_MESSAGES = {
  INVALID_MOVE: 'Coup invalide',
  EMPTY_PIT: 'Case vide',
  NOT_YOUR_TURN: "Ce n'est pas ton tour",
  INVALID_CODE: 'Code de partie invalide',
  GAME_NOT_FOUND: 'Partie non trouvée',
  NETWORK_ERROR: 'Erreur réseau',
  FORBIDDEN_ATTACK: 'Attaque interdite par les règles',
};

// Logs des actions
const LOG_TYPES = {
  GAME_CREATED: 'GAME_CREATED',
  PLAYER_JOINED: 'PLAYER_JOINED',
  MOVE_PLAYED: 'MOVE_PLAYED',
  CAPTURE_MADE: 'CAPTURE_MADE',
  GAME_ENDED: 'GAME_ENDED',
};
