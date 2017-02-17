<?php


  function getArticlesFromDatabase() {
    return [
      [
        'time' => date('d.m.Y'),
        'body' => 'This is body of an article',
      ],
      [
        'time' => date('d.m.Y'),
        'body' => 'Another great article',
      ]
    ];
  }

  $articles = getArticlesFromDatabase();
  if (isset($_POST['body'])) {
    $articles[] = [
      'body' => $_POST['body'],
      'time' => date('d.m.Y'),
    ];
  }
?>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <?php if (isset($title)): ?>
    <h1><?= $title ?></h1>
  <?php endif; ?>
  <form method="post" action="/php/index.php">
    <input type="text" name="body">
    <button>Send</button>
  </form>
  <?php foreach($articles as $k => $article): ?>
    <article>
      <time><?= $article['time'] ?></time>
      <p>
        <?= $article['body'] ?>
      </p>
    </article>
  <?php endforeach; ?>
</body>
</html>
