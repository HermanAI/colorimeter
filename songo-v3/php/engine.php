<?php
// ============================================================
//  engine.php — Songo 237 · Version 3 Modernisée
//  Moteur de jeu en PHP
// ============================================================

const PITS = 7;
const INIT_SEEDS = 5;
const TOTAL_SEEDS = 70;
const WIN_SCORE = 40;
const LOW_BOARD = 10;
const CAPTURE_VALUES = [2, 3, 4];
const PLAYERS = ['north' => 'north', 'south' => 'south'];

function initialGameState() {
    return [
        'board' => [
            'north' => array_fill(0, PITS, INIT_SEEDS),
            'south' => array_fill(0, PITS, INIT_SEEDS),
        ],
        'scores' => ['north' => 0, 'south' => 0],
        'current' => 'south',
        'status' => 'playing',
        'winner' => null,
        'reason' => null,
        'moveNumber' => 0,
        'log' => [],
    ];
}

function createCycle() {
    $cycle = [];
    for ($i = 0; $i < PITS; $i++) {
        $cycle[] = ['player' => 'north', 'index' => $i];
    }
    for ($i = PITS - 1; $i >= 0; $i--) {
        $cycle[] = ['player' => 'south', 'index' => $i];
    }
    return $cycle;
}

$CYCLE = createCycle();

function other($p) {
    return $p === 'north' ? 'south' : 'north';
}

function sumArr($a) {
    return array_sum($a);
}

function boardTotal(&$s) {
    return sumArr($s['board']['north']) + sumArr($s['board']['south']);
}

function grandTotal(&$s) {
    return $s['scores']['north'] + $s['scores']['south'] + boardTotal($s);
}

function isCaptureValue($n) {
    return in_array($n, CAPTURE_VALUES);
}

function samePos($a, $b) {
    return $a['player'] === $b['player'] && $a['index'] === $b['index'];
}

function cycleIndex($p, $i, &$cycle) {
    foreach ($cycle as $k => $c) {
        if ($c['player'] === $p && $c['index'] === $i) return $k;
    }
    return -1;
}

function nextPositions($p, $i, &$cycle) {
    $start = cycleIndex($p, $i, $cycle);
    $positions = [];
    for ($step = 1; $step <= 13; $step++) {
        $positions[] = $cycle[($start + $step) % 14];
    }
    return $positions;
}

function sowSeed(&$s, $player, $pitIndex, &$cycle) {
    $seeds = $s['board'][$player][$pitIndex];
    if ($seeds <= 0) throw new Exception('Case vide');
    
    $s['board'][$player][$pitIndex] = 0;
    $path = nextPositions($player, $pitIndex, $cycle);
    $visited = [];
    
    for ($k = 0; $k < $seeds; $k++) {
        $pos = $path[$k];
        $s['board'][$pos['player']][$pos['index']]++;
        $visited[] = $pos;
    }
    
    return [
        'visited' => $visited,
        'last' => end($visited),
    ];
}

function resolveCaptures(&$s, $player, $sowResult, &$cycle) {
    $last = $sowResult['last'];
    $opp = other($player);
    
    if ($last['player'] !== $opp) {
        return ['captured' => 0, 'type' => 'aucune'];
    }
    
    $count = $s['board'][$last['player']][$last['index']];
    if (!isCaptureValue($count)) {
        return ['captured' => 0, 'type' => 'valeur_incorrecte'];
    }
    
    $chain = captureChain($s, $player, $last, $cycle);
    
    if (wouldEmpty($s, $player, $chain)) {
        return ['captured' => 0, 'type' => 'affamement'];
    }
    
    $total = 0;
    foreach ($chain as $pos) {
        $s['board'][$pos['player']][$pos['index']] -= $pos['count'];
        $total += $pos['count'];
    }
    $s['scores'][$player] += $total;
    
    return [
        'captured' => $total,
        'type' => count($chain) > 1 ? 'chaine' : 'normale',
    ];
}

function captureChain(&$s, $player, $lastPos, &$cycle) {
    $opp = other($player);
    $path = array_filter(nextPositions($player, 0, $cycle), fn($p) => $p['player'] === $opp);
    
    $idx = -1;
    foreach ($path as $k => $pos) {
        if (samePos($pos, $lastPos)) { $idx = $k; break; }
    }
    
    if ($idx <= 0) return [];
    
    $chain = [];
    for ($k = $idx; $k >= 0; $k--) {
        $pos = $path[$k];
        $count = $s['board'][$pos['player']][$pos['index']];
        if (!isCaptureValue($count)) break;
        $chain[] = array_merge($pos, ['count' => $count]);
    }
    
    return $chain;
}

function wouldEmpty(&$s, $player, $chain) {
    $opp = other($player);
    $copy = $s['board'][$opp];
    
    foreach ($chain as $pos) {
        if ($pos['player'] === $opp) {
            $copy[$pos['index']] -= $pos['count'];
        }
    }
    
    return array_sum($copy) === 0;
}

function applyGameMove(&$state, $pitIndex) {
    global $CYCLE;
    
    if ($state['status'] !== 'playing') {
        throw new Exception('Partie terminée');
    }
    
    $player = $state['current'];
    if ($state['board'][$player][$pitIndex] <= 0) {
        throw new Exception('Case vide');
    }
    
    $state['moveNumber']++;
    
    $sowResult = sowSeed($state, $player, $pitIndex, $CYCLE);
    $captures = resolveCaptures($state, $player, $sowResult, $CYCLE);
    
    $info = ($player === 'north' ? '🔵 Nord' : '🔴 Sud') . " joue case $pitIndex";
    if ($captures['captured'] > 0) {
        $state['log'][] = $info . " → capture " . $captures['captured'] . " [" . $captures['type'] . "]";
    } else {
        $state['log'][] = $info;
    }
    
    // Vérifier fin
    if ($state['scores']['north'] >= WIN_SCORE || $state['scores']['south'] >= WIN_SCORE) {
        $state['status'] = 'ended';
        $state['reason'] = 'score_40';
        $state['winner'] = $state['scores']['north'] >= WIN_SCORE ? 'north' : 'south';
        collectRemaining($state);
    } elseif (boardTotal($state) < LOW_BOARD) {
        collectRemaining($state);
        $state['status'] = 'ended';
        $state['reason'] = 'low_board';
        $state['winner'] = computeWinner($state);
    } else {
        $state['current'] = other($player);
    }
    
    if (count($state['log']) > 30) {
        $state['log'] = array_slice($state['log'], -30);
    }
    
    if (grandTotal($state) !== TOTAL_SEEDS) {
        $state['log'][] = '❌ ERREUR INVARIANT';
    }
    
    return $state;
}

function collectRemaining(&$s) {
    $s['scores']['north'] += sumArr($s['board']['north']);
    $s['scores']['south'] += sumArr($s['board']['south']);
    $s['board']['north'] = array_fill(0, PITS, 0);
    $s['board']['south'] = array_fill(0, PITS, 0);
}

function computeWinner(&$s) {
    if ($s['scores']['north'] >= WIN_SCORE) return 'north';
    if ($s['scores']['south'] >= WIN_SCORE) return 'south';
    if ($s['scores']['north'] > $s['scores']['south']) return 'north';
    if ($s['scores']['south'] > $s['scores']['north']) return 'south';
    return 'draw';
}
