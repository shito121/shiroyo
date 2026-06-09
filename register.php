<?php
require_once __DIR__ . '/common.php';

$data = json_request_body();
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $email === '' || $password === '') {
    send_json(['error' => 'Username, email, dan password diperlukan.'], 400);
}

$users = read_users();
foreach ($users as $user) {
    if (strcasecmp($user['username'], $username) === 0) {
        send_json(['error' => 'Username sudah terpakai.'], 409);
    }
    if (strcasecmp($user['email'], $email) === 0) {
        send_json(['error' => 'Email sudah terdaftar.'], 409);
    }
}

$users[] = [
    'id' => bin2hex(random_bytes(16)),
    'username' => $username,
    'email' => $email,
    'passwordHash' => hash_password($password),
    'authToken' => null,
    'resetToken' => null,
    'resetTokenExpiry' => null,
];

save_users($users);
send_json(['message' => 'Pendaftaran berhasil. Silakan login.'], 201);
