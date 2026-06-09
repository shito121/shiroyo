<?php
require_once __DIR__ . '/common.php';

$data = json_request_body();
$token = trim($data['token'] ?? '');
$password = $data['password'] ?? '';

if ($token === '' || $password === '') {
    send_json(['error' => 'Token dan password baru diperlukan.'], 400);
}

$users = read_users();
$updated = false;
foreach ($users as &$user) {
    if (!empty($user['resetToken']) && hash_equals($user['resetToken'], $token) && !empty($user['resetTokenExpiry']) && $user['resetTokenExpiry'] > time()) {
        $user['passwordHash'] = hash_password($password);
        $user['resetToken'] = null;
        $user['resetTokenExpiry'] = null;
        $updated = true;
        break;
    }
}

if (!$updated) {
    send_json(['error' => 'Token reset tidak valid atau kadaluwarsa.'], 400);
}

save_users($users);
send_json(['message' => 'Password berhasil diperbarui. Silakan login dengan password baru.']);
