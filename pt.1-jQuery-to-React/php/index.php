<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


require('./template.php');

/*

function renderTemplate(array $vars, string $templatePath) {
  ob_start();
  extract($vars);
  require($templatePath);
  return ob_get_clean();
}


print(renderTemplate(['title' => 'Cau!'], './template.php'));
*/
