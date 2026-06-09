<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

function read_users() {
    $path = __DIR__ . '/data/users.json';
    if (!file_exists($path)) {
        if (!is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }
        file_put_contents($path, json_encode([], JSON_PRETTY_PRINT));
    }
    $json = file_get_contents($path);
    return json_decode($json ?: '[]', true);
}

function save_users(array $users) {
    $path = __DIR__ . '/data/users.json';
    file_put_contents($path, json_encode($users, JSON_PRETTY_PRINT));
}

function hash_password($password) {
    return hash('sha256', $password);
}

function create_token() {
    return bin2hex(random_bytes(32));
}

function send_json($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function get_bearer_token() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $auth = $headers['authorization'];
    } else {
        return null;
    }

    if (strpos($auth, 'Bearer ') === 0) {
        return substr($auth, 7);
    }
    return null;
}

function find_user_by_token($token) {
    if (!$token) {
        return null;
    }
    $users = read_users();
    foreach ($users as $user) {
        if (!empty($user['authToken']) && hash_equals($user['authToken'], $token)) {
            return $user;
        }
    }
    return null;
}

function json_request_body() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?: [];
}
