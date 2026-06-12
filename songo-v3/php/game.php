<?php
// ============================================================
//  game.php — Songo 237 · Version 3 Modernisée
//  API Ajax Backend
// ============================================================

require_once 'config.php';
require_once 'engine.php';

// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = [];

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?? [];
    if (empty($input)) $input = $_POST;
} else {
    $input = $_GET;
}

$action = $input['action'] ?? '';

switch ($action) {
    case 'new':
        handleNewGame();
        break;
    case 'join':
        handleJoinGame($input);
        break;
    case 'move':
        handleMove($input);
        break;
    case 'state':
        handleGetState($input);
        break;
    default:
        jsonResponse(['ok' => false, 'error' => 'Action inconnue'], 400);
}

// ============================================================
//  HANDLERS
// ============================================================

function handleNewGame() {
    $code = strtoupper(substr(md5(uniqid()), 0, 6));
    $state = initialGameState();
    
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO parties (code_partie, etat) VALUES (?, ?)');
    $stmt->execute([$code, json_encode($state)]);
    
    jsonResponse([
        'ok' => true,
        'code' => $code,
        'state' => $state,
    ]);
}

function handleJoinGame($input) {
    $code = strtoupper(trim($input['code'] ?? ''));
    $role = $input['role'] ?? 'north';
    
    if (!$code || !in_array($role, ['north', 'south'])) {
        jsonResponse(['ok' => false, 'error' => 'Paramètres invalides'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM parties WHERE code_partie = ? LIMIT 1');
    $stmt->execute([$code]);
    $row = $stmt->fetch();
    
    if (!$row) {
        jsonResponse(['ok' => false, 'error' => 'Partie introuvable'], 404);
    }
    
    $sessionId = session_id() ?: uniqid();
    $col = 'joueur_' . $role;
    $stmt = $db->prepare("UPDATE parties SET $col = ? WHERE code_partie = ?");
    $stmt->execute([$sessionId, $code]);
    
    jsonResponse([
        'ok' => true,
        'session_id' => $sessionId,
        'role' => $role,
        'state' => json_decode($row['etat'], true),
    ]);
}

function handleMove($input) {
    $code = strtoupper(trim($input['code'] ?? ''));
    $pitIndex = intval($input['pitIndex'] ?? -1);
    
    if (!$code || $pitIndex < 0 || $pitIndex > 6) {
        jsonResponse(['ok' => false, 'error' => 'Paramètres invalides'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM parties WHERE code_partie = ? LIMIT 1');
    $stmt->execute([$code]);
    $row = $stmt->fetch();
    
    if (!$row) {
        jsonResponse(['ok' => false, 'error' => 'Partie introuvable'], 404);
    }
    
    $state = json_decode($row['etat'], true);
    
    try {
        $state = applyGameMove($state, $pitIndex);
        
        $stmt = $db->prepare('UPDATE parties SET etat = ? WHERE code_partie = ?');
        $stmt->execute([json_encode($state), $code]);
        
        jsonResponse(['ok' => true, 'state' => $state]);
    } catch (Exception $e) {
        jsonResponse(['ok' => false, 'error' => $e->getMessage()], 400);
    }
}

function handleGetState($input) {
    $code = strtoupper(trim($input['code'] ?? ''));
    
    if (!$code) {
        jsonResponse(['ok' => false, 'error' => 'Code manquant'], 400);
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT etat FROM parties WHERE code_partie = ? LIMIT 1');
    $stmt->execute([$code]);
    $row = $stmt->fetch();
    
    if (!$row) {
        jsonResponse(['ok' => false, 'error' => 'Partie introuvable'], 404);
    }
    
    jsonResponse(['ok' => true, 'state' => json_decode($row['etat'], true)]);
}
