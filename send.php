<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Переменные, которые отправляет пользователь
$name = $_POST['name'];
$email = $_POST['email'];
$text = $_POST['message'];
// $file = $_FILES['image'];

// Формирование самого письма
$title = "Письмо из phpmailer";
// $body = "
// <h2>Новое письмо</h2>
// <b>Имя:</b> $name<br>
// <b>Почта:</b> $email<br><br>
// <b>Сообщение:</b><br>$text<br>
// <b>Картинка или файл:</b><br>$file
// ";

if (trim(!empty($name))) {
    $body .= '<p><strong>Имя:</strong> ' . $name . '</p>';
}

if (trim(!empty($email))) {
    $body .= '<p><strong>Почтовый ящик:</strong> ' . $email . '</p>';
}

if (trim(!empty($text))) {
    $body .= '<p><strong>Сообщение:</strong> ' . $text . '</p>';
}


// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    //$mail->SMTPDebug = 2;
    $mail->Debugoutput = function ($str, $level) {
        $GLOBALS['status'][] = $str;
    };

    // Настройки вашей почты
    $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
    $mail->Username   = 'digtyarsergio@gmail.com'; // Логин на почте
    $mail->Password   = 'dawuzxhedwtsdwof'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('mail@gmail.com', 'Имя отправителя'); // Адрес самой почты и имя отправителя

    // Получатель письма
    $mail->addAddress('digtyarsergio@gmail.com');

    //Для прикрепления файла или изображения
    if (!empty($_FILES['image']['tmp_name'])) {
        $filePath = __DIR__ . '/files/' . $_FILES['image']['name'];
    }

    if (copy($_FILES['image']['tmp_name'], $filePath)) {
        $fileAttach = $filePath;
        $body .= '<p><strong>Фото в приложении</strong>';
        $mail->addAttachment($fileAttach);
    }

    // Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;

    // Проверяем отравленность сообщения
    if ($mail->send()) {
        $result = "success";
    } else {
        $result = "error";
    }
} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата
echo json_encode(["result" => $result, "resultfile" => $rfile, "status" => $status]);
