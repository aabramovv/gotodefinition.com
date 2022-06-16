<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once 'vendor/autoload.php';

$domain = 'gotodefinition.com';
$post = (!empty($_POST)) ? true : false;

$errorExit = json_encode([
    'result' => 'error',
    'message' => 'Message not sent'
]);

if ($post) {
    $nickname = stripslashes($_POST['nickname']);
    if (!empty($nickname)) {
        exit($errorExit);
    }

    $name = stripslashes($_POST['name']);
    $phone = stripslashes($_POST['phone']);
    $email = stripslashes($_POST['useremail']);
    $text = stripslashes($_POST['text']);

    $form = stripslashes($_POST['form']);
    if ($form == 'schedule') {
        $lastname = stripslashes($_POST['lastname']);
        $company = stripslashes($_POST['company']);
        $datetime = stripslashes($_POST['datetime']);
    }

    $subject = 'Заявка с сайта ' . $domain;
    $error = '';
    $message = '
                <html lang="ru">
                <head>
                <title>Заявка с сайта</title>
                </head>
                <body>
                    <p><strong>Name:</strong> ' . $name . '</p>
                    <p><strong>Phone:</strong> ' . $phone . '</p>
                    <p><strong>Email:</strong> ' . $email . '</p>
                    <p><strong>Text:</strong> ' . $text . '</p>
              ';

    if ($form == 'schedule') {
        $message .= '
            <p><strong>Lastname:</strong> ' . $lastname . '</p>
            <p><strong>Company:</strong> ' . $company . '</p>
            <p><strong>Datetime:</strong> ' . $datetime . '</p>
        ';
    }

    $message .= '</body>
               </html>';

    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->Host = 'smtp.yandex.com';
    $mail->CharSet = 'UTF-8';
    $mail->Port = 587;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAuth = true;
    $mail->Username = 'art4biz.webdeveloper@yandex.ru';
    $mail->Password = 'xbsomcysshhsgqxk';
    $mail->setFrom('art4biz.webdeveloper@yandex.ru', $domain);
    $mail->addAddress('potapovw@yandex.ru');
    //$mail->addAddress('webdeveloper@art4biz.ru');
    $mail->Subject = $subject;
    $mail->IsHTML(true);
    $mail->Body = $message;

    $sendingResult = $mail->send();

    $mes = '';
    if (!$sendingResult) {
        $mes = $mail->ErrorInfo;
        $result = 'error';
    } else {
        $result = 'success';
    }

    $exit = json_encode([
        'result' => $result,
        'message' => $mes
    ]);

    exit($exit);
}

exit($errorExit);
