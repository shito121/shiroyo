<?php
require_once __DIR__ . '/common.php';

$data = json_request_body();
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    send_json(['error' => 'Username dan password diperlukan.'], 400);
}

$users = read_users();
foreach ($users as &$user) {
    if (strcasecmp($user['username'], $username) === 0 && hash_password($password) === $user['passwordHash']) {
        $user['authToken'] = create_token();
        save_users($users);
        send_json([
            'token' => $user['authToken'],
            'username' => $user['username'],
            'email' => $user['email'],
        ]);
    }
}

send_json(['error' => 'Username atau password salah.'], 401);
