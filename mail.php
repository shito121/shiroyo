<?php
require_once __DIR__ . '/config.php';

function send_email_smtp($to, $subject, $html, $text = '') {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $username = SMTP_USER;
    $password = SMTP_PASS;
    $from = SMTP_FROM;
    $fromName = SMTP_FROM_NAME;

    $transport = $port === 465 ? 'ssl' : 'tcp';
    $remote = sprintf('%s://%s:%d', $transport, $host, $port);
    $context = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
    $fp = stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $context);
    if (!$fp) {
        throw new Exception("SMTP connect failed: $errstr ($errno)");
    }

    $read = fn() => implode('', array_filter([$line = fgets($fp, 515)]));
    $send = fn($command) => fwrite($fp, $command . "\r\n");
    $expect = function($code) use ($read) {
        $response = $read();
        if (substr($response, 0, 3) !== (string) $code) {
            throw new Exception("SMTP error: $response");
        }
        return $response;
    };

    $expect(220);
    $send("EHLO " . gethostname());
    $expect(250);

    if ($transport === 'tcp') {
        $send('STARTTLS');
        $expect(220);
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new Exception('Failed to enable STARTTLS');
        }
        $send("EHLO " . gethostname());
        $expect(250);
    }

    $send('AUTH LOGIN');
    $expect(334);
    $send(base64_encode($username));
    $expect(334);
    $send(base64_encode($password));
    $expect(235);

    $send('MAIL FROM:<' . $from . '>');
    $expect(250);
    $send('RCPT TO:<' . $to . '>');
    $expect(250);
    $send('DATA');
    $expect(354);

    $boundary = md5(time());
    $headers = [];
    $headers[] = 'From: ' . $fromName . ' <' . $from . '>';
    $headers[] = 'To: ' . $to;
    $headers[] = 'Subject: ' . $subject;
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

    $body = [];
    $body[] = '--' . $boundary;
    $body[] = 'Content-Type: text/plain; charset=UTF-8';
    $body[] = 'Content-Transfer-Encoding: 8bit';
    $body[] = '';
    $body[] = $text;
    $body[] = '--' . $boundary;
    $body[] = 'Content-Type: text/html; charset=UTF-8';
    $body[] = 'Content-Transfer-Encoding: 8bit';
    $body[] = '';
    $body[] = $html;
    $body[] = '--' . $boundary . '--';

    $message = implode("\r\n", array_merge($headers, [''], $body, ['']));
    $send($message . '\r\n.');
    $expect(250);
    $send('QUIT');
    fclose($fp);

    return true;
}

function send_email($to, $subject, $html, $text = '') {
    if (SMTP_USE_SMTP) {
        return send_email_smtp($to, $subject, $html, $text);
    }

    $boundary = md5(time());
    $headers = [];
    $headers[] = 'From: ' . SMTP_FROM_NAME . ' <' . SMTP_FROM . '>';
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';

    $body = [];
    $body[] = '--' . $boundary;
    $body[] = 'Content-Type: text/plain; charset=UTF-8';
    $body[] = '';
    $body[] = $text;
    $body[] = '--' . $boundary;
    $body[] = 'Content-Type: text/html; charset=UTF-8';
    $body[] = '';
    $body[] = $html;
    $body[] = '--' . $boundary . '--';

    return mail($to, $subject, implode("\r\n", $body), implode("\r\n", $headers));
}
