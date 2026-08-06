<?php
/**
 * Comparador antes/después.
 * Parámetros: $before, $after, $alt (opcionales).
 */
declare(strict_types=1);

$before = trim((string) ($before ?? ''));
$after = trim((string) ($after ?? ''));
$alt = trim((string) ($alt ?? 'Comparación del proyecto'));

if ($before === '' || $after === '') {
    return;
}
$id = 'ba-' . substr(bin2hex(random_bytes(4)), 0, 8);
?>
<div class="before-after" data-before-after>
  <div class="before-after-frame">
    <img class="before-after-img before-after-after" src="<?= e(base_url($after)) ?>" alt="<?= e($alt) ?> — después" width="960" height="600" loading="lazy">
    <div class="before-after-overlay" data-ba-overlay style="width:50%">
      <img class="before-after-img before-after-before" src="<?= e(base_url($before)) ?>" alt="<?= e($alt) ?> — antes" width="960" height="600" loading="lazy">
    </div>
    <div class="before-after-handle" data-ba-handle style="left:50%" aria-hidden="true"></div>
  </div>
  <label class="before-after-label" for="<?= e($id) ?>">
    <span>Antes</span>
    <input id="<?= e($id) ?>" class="before-after-range" type="range" min="0" max="100" value="50" data-ba-range aria-label="Comparar antes y después">
    <span>Después</span>
  </label>
</div>
