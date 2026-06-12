// ============================================================
//  ui.js — Songo 237 · Version 3 Modernisée
//  Rendu DOM uniquement
// ============================================================

class UIRenderer {
  constructor() {
    this.state = null;
    this.myRole = null;
    this.gameCode = null;
  }

  render(state, myRole, gameCode) {
    this.state = state;
    this.myRole = myRole;
    this.gameCode = gameCode;

    if (!state) return;

    this.renderScores();
    this.renderBoard();
    this.renderStatus();
    this.renderLog();
  }

  renderScores() {
    document.getElementById('val-north').textContent = this.state.scores[PLAYERS.NORTH];
    document.getElementById('val-south').textContent = this.state.scores[PLAYERS.SOUTH];

    const northBox = document.getElementById('score-north');
    const southBox = document.getElementById('score-south');

    northBox.classList.toggle(
      'active',
      this.state.current === PLAYERS.NORTH && this.state.status === GAME_STATUS.PLAYING
    );
    southBox.classList.toggle(
      'active',
      this.state.current === PLAYERS.SOUTH && this.state.status === GAME_STATUS.PLAYING
    );

    northBox.classList.toggle('mine', this.myRole === PLAYERS.NORTH);
    southBox.classList.toggle('mine', this.myRole === PLAYERS.SOUTH);
  }

  renderBoard() {
    const legal = engine.getLegalMoves();
    const current = this.state.current;

    // Nord : N6 → N0 (gauche à droite)
    this.renderRow('row-north', PLAYERS.NORTH, [6, 5, 4, 3, 2, 1, 0], legal, current);

    // Sud : S0 → S6 (gauche à droite)
    this.renderRow('row-south', PLAYERS.SOUTH, [0, 1, 2, 3, 4, 5, 6], legal, current);
  }

  renderRow(rowId, player, indices, legal, currentPlayer) {
    const row = document.getElementById(rowId);
    row.innerHTML = '';

    for (const idx of indices) {
      const seeds = this.state.board[player][idx];
      const isPlayable =
        player === currentPlayer &&
        player === this.myRole &&
        legal.includes(idx) &&
        this.state.status === GAME_STATUS.PLAYING;

      const div = document.createElement('div');
      div.className = 'pit' + (seeds === 0 ? ' empty' : '') + (isPlayable ? ' playable' : '');
      div.innerHTML = `<span class="pit-id">${player[0].toUpperCase()}${idx}</span>
                       <span class="pit-num">${seeds}</span>`;

      if (isPlayable) {
        div.addEventListener('click', () => {
          div.classList.add('just-sown');
          ajaxApplyMove(idx);
        });
      }

      row.appendChild(div);
    }
  }

  renderStatus() {
    const sb = document.getElementById('status');

    if (this.state.status === GAME_STATUS.ENDED) {
      sb.className = 'status-bar win';
      if (this.state.winner === 'draw') {
        sb.textContent = `🤝 Match nul ! (${this.state.scores[PLAYERS.NORTH]} - ${this.state.scores[PLAYERS.SOUTH]})`;
      } else {
        const winner = this.state.winner === PLAYERS.NORTH ? '🔵 Nord' : '🔴 Sud';
        sb.textContent = `🏆 ${winner} gagne ! (${this.state.scores[PLAYERS.NORTH]} - ${this.state.scores[PLAYERS.SOUTH]})`;
      }
    } else {
      sb.className = 'status-bar info';
      if (this.state.current === this.myRole) {
        sb.innerHTML = `<span class="player-name">⭐ C'est ton tour !</span> Clique une case verte`;
      } else {
        const opponent = this.state.current === PLAYERS.NORTH ? '🔵 Nord' : '🔴 Sud';
        sb.textContent = `⏳ Tour de ${opponent}...`;
      }
    }
  }

  renderLog() {
    const logDiv = document.getElementById('log');
    logDiv.innerHTML = this.state.log
      .slice()
      .reverse()
      .map((l) => `<p>${l}</p>`)
      .join('');
  }

  showGameCode(code) {
    const gc = document.getElementById('game-code');
    gc.style.display = 'block';
    gc.innerHTML = `Code : <strong>${code}</strong> — Tu joues : ${this.myRole === PLAYERS.NORTH ? '🔵 Nord' : '🔴 Sud'}`;
  }

  showError(msg) {
    const sb = document.getElementById('status');
    sb.className = 'status-bar error';
    sb.textContent = `❌ ${msg}`;
  }

  showConnecting(msg) {
    const sb = document.getElementById('status');
    sb.className = 'status-bar info';
    sb.textContent = `⏳ ${msg}`;
  }

  hideLobby() {
    document.getElementById('lobby').style.display = 'none';
  }
}

// Instanciation globale
const ui = new UIRenderer();
