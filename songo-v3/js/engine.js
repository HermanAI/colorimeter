// ============================================================
//  engine.js — Songo 237 · Version 3 Modernisée
//  Moteur de jeu pur - Logique sans dépendances DOM
// ============================================================

class GameEngine {
  constructor() {
    this.state = null;
  }

  // Initialiser une nouvelle partie
  createGame() {
    this.state = {
      board: {
        [PLAYERS.NORTH]: Array(GAME_CONFIG.PITS).fill(GAME_CONFIG.INIT_SEEDS),
        [PLAYERS.SOUTH]: Array(GAME_CONFIG.PITS).fill(GAME_CONFIG.INIT_SEEDS),
      },
      scores: {
        [PLAYERS.NORTH]: 0,
        [PLAYERS.SOUTH]: 0,
      },
      current: PLAYERS.SOUTH, // Sud commence
      status: GAME_STATUS.PLAYING,
      winner: null,
      reason: null,
      moveNumber: 0,
      log: [],
    };
    return this.state;
  }

  // ---- UTILITAIRES ----

  getOther(player) {
    return player === PLAYERS.NORTH ? PLAYERS.SOUTH : PLAYERS.NORTH;
  }

  sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
  }

  boardTotal() {
    return (
      this.sum(this.state.board[PLAYERS.NORTH]) +
      this.sum(this.state.board[PLAYERS.SOUTH])
    );
  }

  grandTotal() {
    return (
      this.state.scores[PLAYERS.NORTH] +
      this.state.scores[PLAYERS.SOUTH] +
      this.boardTotal()
    );
  }

  isCaptureValue(n) {
    return GAME_CONFIG.CAPTURE_VALUES.includes(n);
  }

  samePos(a, b) {
    return a.player === b.player && a.index === b.index;
  }

  // Obtenir le cycle index
  cycleIndex(player, index) {
    return CYCLE.findIndex((c) => c.player === player && c.index === index);
  }

  // Positions suivantes dans le cycle (clockwise)
  nextPositions(player, index) {
    const start = this.cycleIndex(player, index);
    const positions = [];
    for (let step = 1; step <= 13; step++) {
      positions.push(CYCLE[(start + step) % 14]);
    }
    return positions;
  }

  // ---- SEMAILLE ----

  sow(player, pitIndex) {
    const seeds = this.state.board[player][pitIndex];
    if (seeds <= 0) throw new Error(ERROR_MESSAGES.EMPTY_PIT);

    this.state.board[player][pitIndex] = 0;
    const path = this.nextPositions(player, pitIndex);
    const visited = [];

    for (let k = 0; k < seeds; k++) {
      const pos = path[k];
      this.state.board[pos.player][pos.index]++;
      visited.push(pos);
    }

    return {
      visited,
      last: visited[visited.length - 1],
    };
  }

  // ---- CAPTURES ----

  resolveCaptures(player, sowResult) {
    const last = sowResult.last;
    const other = this.getOther(player);

    // Vérifier que la dernière graine est chez l'adversaire
    if (last.player !== other) {
      return { captured: 0, type: 'aucune' };
    }

    const count = this.state.board[last.player][last.index];
    if (!this.isCaptureValue(count)) {
      return { captured: 0, type: 'valeur_incorrecte' };
    }

    // Prise à la chaîne
    const chain = this.captureChain(player, last);

    // Anti-affamement
    if (this.wouldEmpty(player, chain)) {
      return { captured: 0, type: 'affamement' };
    }

    // Appliquer les captures
    let total = 0;
    for (const pos of chain) {
      this.state.board[pos.player][pos.index] -= pos.count;
      total += pos.count;
    }
    this.state.scores[player] += total;

    return {
      captured: total,
      type: chain.length > 1 ? 'chaine' : 'normale',
    };
  }

  captureChain(player, lastPos) {
    const other = this.getOther(player);
    const path = this.nextPositions(player, 0).filter((p) => p.player === other);
    const idx = path.findIndex((pos) => this.samePos(pos, lastPos));

    if (idx <= 0) return [];

    const chain = [];
    for (let k = idx; k >= 0; k--) {
      const pos = path[k];
      const count = this.state.board[pos.player][pos.index];
      if (!this.isCaptureValue(count)) break;
      chain.push({ ...pos, count });
    }

    return chain;
  }

  wouldEmpty(player, chain) {
    const other = this.getOther(player);
    let remaining = this.sum(this.state.board[other]);

    for (const pos of chain) {
      if (pos.player === other) {
        remaining -= pos.count;
      }
    }

    return remaining === 0;
  }

  // ---- COUPS LÉGAUX ----

  getLegalMoves() {
    const player = this.state.current;
    if (this.state.status !== GAME_STATUS.PLAYING) return [];

    const legal = [];
    for (let i = 0; i < GAME_CONFIG.PITS; i++) {
      if (this.state.board[player][i] > 0) {
        legal.push(i);
      }
    }

    return legal.filter((i) => !this.isForbiddenMove(player, i));
  }

  isForbiddenMove(player, pitIndex) {
    const seeds = this.state.board[player][pitIndex];
    // Règles simplifiées pour V3
    return false;
  }

  // ---- APPLICATION D'UN COUP ----

  applyMove(pitIndex) {
    if (this.state.status !== GAME_STATUS.PLAYING) {
      throw new Error('Partie terminée');
    }

    const player = this.state.current;
    const legal = this.getLegalMoves();

    if (!legal.includes(pitIndex)) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN_ATTACK);
    }

    this.state.moveNumber++;

    // Effectuer la semaille
    const sowResult = this.sow(player, pitIndex);
    const captures = this.resolveCaptures(player, sowResult);

    // Logger
    const info = `${player === PLAYERS.NORTH ? '🔵 Nord' : '🔴 Sud'} joue case ${pitIndex}`;
    if (captures.captured > 0) {
      this.state.log.push(
        `${info} → capture ${captures.captured} [${captures.type}]`
      );
    } else {
      this.state.log.push(info);
    }

    // Vérifier la fin
    this.checkGameEnd();

    // Passer au joueur suivant
    if (this.state.status === GAME_STATUS.PLAYING) {
      this.state.current = this.getOther(player);
      this.checkNoLegalMove();
    }

    // Vérifier l'invariant
    if (this.grandTotal() !== GAME_CONFIG.TOTAL_SEEDS) {
      this.state.log.push('❌ ERREUR INVARIANT');
    }

    return this.state;
  }

  checkGameEnd() {
    // Condition 1 : score >= 40
    if (
      this.state.scores[PLAYERS.NORTH] >= GAME_CONFIG.WIN_SCORE ||
      this.state.scores[PLAYERS.SOUTH] >= GAME_CONFIG.WIN_SCORE
    ) {
      this.state.status = GAME_STATUS.ENDED;
      this.state.reason = END_REASONS.SCORE_40;
      this.state.winner =
        this.state.scores[PLAYERS.NORTH] >= GAME_CONFIG.WIN_SCORE
          ? PLAYERS.NORTH
          : PLAYERS.SOUTH;
      this.collectRemaining();
      return;
    }

    // Condition 2 : moins de 10 graines
    if (this.boardTotal() < GAME_CONFIG.LOW_BOARD) {
      this.collectRemaining();
      this.state.status = GAME_STATUS.ENDED;
      this.state.reason = END_REASONS.LOW_BOARD;
      this.state.winner = this.computeWinner();
      return;
    }
  }

  checkNoLegalMove() {
    if (this.getLegalMoves().length === 0) {
      this.collectRemaining();
      this.state.status = GAME_STATUS.ENDED;
      this.state.reason = END_REASONS.NO_LEGAL_MOVE;
      this.state.winner = this.computeWinner();
    }
  }

  collectRemaining() {
    this.state.scores[PLAYERS.NORTH] += this.sum(
      this.state.board[PLAYERS.NORTH]
    );
    this.state.scores[PLAYERS.SOUTH] += this.sum(
      this.state.board[PLAYERS.SOUTH]
    );
    this.state.board[PLAYERS.NORTH] = Array(GAME_CONFIG.PITS).fill(0);
    this.state.board[PLAYERS.SOUTH] = Array(GAME_CONFIG.PITS).fill(0);
  }

  computeWinner() {
    if (this.state.scores[PLAYERS.NORTH] >= GAME_CONFIG.WIN_SCORE)
      return PLAYERS.NORTH;
    if (this.state.scores[PLAYERS.SOUTH] >= GAME_CONFIG.WIN_SCORE)
      return PLAYERS.SOUTH;
    if (this.state.scores[PLAYERS.NORTH] > this.state.scores[PLAYERS.SOUTH])
      return PLAYERS.NORTH;
    if (this.state.scores[PLAYERS.SOUTH] > this.state.scores[PLAYERS.NORTH])
      return PLAYERS.SOUTH;
    return 'draw';
  }
}

// Instanciation globale
const engine = new GameEngine();
