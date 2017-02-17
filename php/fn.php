<?php function renderList(array $arr) { ob_start(); ?>
 <ul class="list">
    <?php foreach($arr as $item): ?>
      <li><?= $item ?></li>
    <?php endforeach; ?>
  </ul>
<?php return ob_get_clean(); } ?>

<?php function richListItem(string $text) { ob_start(); ?>
  <h2 style="color: red"><?= $text ?></h2>
<?php return ob_get_clean(); } ?>


<?= renderList([
  richListItem('a'),
  richListItem('h'),
  richListItem('o'),
  richListItem('j')
]) ?>
