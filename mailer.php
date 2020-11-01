<?php
if($_POST) {
  $to = "info@zonadekoracije.com";
  $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
  $name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
  $message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);
  $body = "Od: $name\nPoruka: $message\nEmail: $email";

  if(@mail($to, "Kontakt forma", $body)) {
    $output = json_encode(array('success' => true));
    die($output);
  } else {
    $output = json_encode(array('success' => false));
    die($output);
  }
}
