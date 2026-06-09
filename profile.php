<?php
require_once __DIR__ . '/common.php';

$token = get_bearer_token();
if (!$token) {
    send_json(['error' => 'Unauthorized'], 401);
}

$user = find_user_by_token($token);
if (!$user) {
    send_json(['error' => 'Unauthorized'], 401);
}

send_json(['username' => $user['username'], 'email' => $user['email']]);
