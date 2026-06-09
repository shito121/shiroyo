<?php
require_once __DIR__ . '/common.php';
require_once __DIR__ . '/mail.php';

$data = json_request_body();
$email = trim($data['email'] ?? '');
if ($email === '') {
    send_json(['error' => 'Email diperlukan.'], 400);
}

$users = read_users();
$found = false;
foreach ($users as &$user) {
    if (strcasecmp($user['email'], $email) === 0) {
        $found = true;
        $user['resetToken'] = create_token();
        $user['resetTokenExpiry'] = time() + 3600;
        $resetLink = BASE_URL . '/anime.html?resetToken=' . urlencode($user['resetToken']) . '&email=' . urlencode($user['email']);
        $text = "Permintaan reset password diterima. Gunakan tautan berikut:\n\n" . $resetLink;
        $html = "<p>Permintaan reset password diterima.</p><p>Gunakan tautan berikut:</p><p><a href=\"{$resetLink}\">{$resetLink}</a></p>";
        try {
            send_email($user['email'], 'Reset Password Shirokazuki Anime', $html, $text);
        } catch (Exception $e) {
            send_json(['error' => 'Gagal mengirim email reset. ' . $e->getMessage()], 500);
        }
        break;
    }
}

save_users($users);
send_json(['message' => 'Jika email ditemukan, instruksi reset akan dikirimkan.']);
