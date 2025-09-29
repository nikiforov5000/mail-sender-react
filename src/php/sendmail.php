<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set("log_errors", 1);
ini_set("error_log", __DIR__ . "/mail_errors.log");


require __DIR__ . '/src/Exception.php';
require __DIR__ . '/src/PHPMailer.php';
require __DIR__ . '/src/SMTP.php';

header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Use POST method"]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON", "raw" => $raw]);
    exit;
}

$mail = new PHPMailer(true);

try {
    // SMTP config
    $mail->isSMTP();
    $mail->Host       = "autoex.kz";
    $mail->SMTPAuth   = true;
    $mail->Username   = "info@autoex.kz";
    $mail->Password   = "277514289"; // ⚠️ move to config/.env
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    // Sender
    
    // Recipients
    foreach ($data['emails'] as $recipient) {
        if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            continue; // skip invalid
        }
        
        $mail->clearAddresses();  // important: reset recipients each loop
        $mail->setFrom("info@autoex.kz", "Autoex Mailer");
        $mail->addAddress($recipient);
        
        $mail->addReplyTo("info@autoex.kz");
        $mail->Subject = $data['subject'];
        $mail->isHTML(true);
        $mail->Body    = $data['html'];
        $mail->AltBody = strip_tags($data['html']);

        $mail->send();
    }

    // Content
    $mail->isHTML(true);
    $mail->Body    = $data['html'];
    $mail->AltBody = strip_tags($data['html']);


    $mail->send();
    echo json_encode(["success" => true, "message" => "Email sent"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $mail->ErrorInfo]);
}
