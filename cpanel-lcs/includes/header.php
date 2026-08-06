<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data.php';

$pageTitle = $pageTitle ?? SITE_NAME;
$pageDescription = $pageDescription ?? 'Ejecutamos proyectos de construcción, infraestructura y mantenimiento con enfoque en calidad, seguridad y cumplimiento de plazos.';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($pageTitle) ?></title>
  <meta name="description" content="<?= e($pageDescription) ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(base_url('assets/css/style.css')) ?>?v=20260805c">
  <link rel="icon" href="<?= e(base_url('assets/img/brand/logo-lcs.jpeg')) ?>">
</head>
<body>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="<?= e(base_url('index.php')) ?>">
      <img src="<?= e(base_url('assets/img/brand/logo-lcs.jpeg')) ?>" alt="LCS — Luque Construcción y Servicios">
    </a>
    <nav class="nav" aria-label="Principal">
      <a class="<?= e(is_active('index')) ?>" href="<?= e(base_url('index.php')) ?>">Inicio</a>
      <a class="<?= e(is_active('nosotros')) ?>" href="<?= e(base_url('nosotros.php')) ?>">Nosotros</a>
      <a class="<?= e(is_active('servicios')) ?>" href="<?= e(base_url('servicios.php')) ?>">Servicios</a>
      <a class="<?= e(is_active('proyectos') || is_active('proyecto')) ?>" href="<?= e(base_url('proyectos.php')) ?>">Proyectos</a>
      <a class="<?= e(is_active('videos')) ?>" href="<?= e(base_url('videos.php')) ?>">Videos</a>
      <a class="<?= e(is_active('clientes')) ?>" href="<?= e(base_url('clientes.php')) ?>">Clientes</a>
      <a class="<?= e(is_active('certificaciones')) ?>" href="<?= e(base_url('certificaciones.php')) ?>">Certificaciones</a>
      <a class="<?= e(is_active('contacto')) ?>" href="<?= e(base_url('contacto.php')) ?>">Contacto</a>
    </nav>
    <a class="btn btn-outline-gold header-cta" href="<?= e(base_url('contacto.php')) ?>">Cotizar</a>
    <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false">Menú</button>
  </div>
  <nav class="nav-mobile" data-menu-panel aria-label="Móvil">
    <a href="<?= e(base_url('index.php')) ?>">Inicio</a>
    <a href="<?= e(base_url('nosotros.php')) ?>">Nosotros</a>
    <a href="<?= e(base_url('servicios.php')) ?>">Servicios</a>
    <a href="<?= e(base_url('proyectos.php')) ?>">Proyectos</a>
    <a href="<?= e(base_url('videos.php')) ?>">Videos</a>
    <a href="<?= e(base_url('clientes.php')) ?>">Clientes</a>
    <a href="<?= e(base_url('certificaciones.php')) ?>">Certificaciones</a>
    <a href="<?= e(base_url('contacto.php')) ?>">Contacto</a>
    <a class="btn btn-gold" href="<?= e(base_url('contacto.php')) ?>">Cotizar</a>
  </nav>
</header>
<main>
