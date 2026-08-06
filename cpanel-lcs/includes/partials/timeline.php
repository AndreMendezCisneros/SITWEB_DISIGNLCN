<?php
/**
 * Timeline vertical.
 * Requiere $timeline (array) y opcionalmente $timelineLimit (int).
 */
declare(strict_types=1);

$items = $timeline ?? [];
if (isset($timelineLimit) && is_int($timelineLimit) && $timelineLimit > 0) {
    $items = array_slice($items, 0, $timelineLimit);
}
if ($items === []) {
    return;
}
?>
<ol class="timeline" aria-label="Trayectoria LCS">
  <?php foreach ($items as $item): ?>
    <li class="timeline-item reveal">
      <div class="timeline-marker" aria-hidden="true"></div>
      <div class="timeline-card">
        <span class="timeline-year"><?= e((string) ($item['year'] ?? '')) ?></span>
        <h3 class="timeline-title"><?= e((string) ($item['title'] ?? '')) ?></h3>
        <p class="timeline-body"><?= e((string) ($item['body'] ?? '')) ?></p>
      </div>
    </li>
  <?php endforeach; ?>
</ol>
