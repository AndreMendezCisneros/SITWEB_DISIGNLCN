from PIL import Image
from pathlib import Path

base = Path(r"E:\WEBCONSTRUCTORA\SITWEB_DISIGNLCN\cpanel-lcs\assets\img")


def save_info(path: Path) -> None:
    print(f"{path.name}: {path.stat().st_size / 1024:.1f} KB")


# 1) Hero poster ligero (reemplaza uso del PNG pesado)
hero = Image.open(base / "hero.png").convert("RGB")
w, h = hero.size
if w > 1600:
    hero = hero.resize((1600, int(h * 1600 / w)), Image.Resampling.LANCZOS)
poster = base / "hero-poster.jpg"
hero.save(poster, "JPEG", quality=72, optimize=True, progressive=True)
save_info(poster)

# 2) Logos de clientes sobredimensionados
for name in ["callao.png", "gica.png", "municipalidad-mala.png", "samegua.png"]:
    p = base / "clientes" / name
    if not p.exists():
        continue
    im = Image.open(p)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA")
    w, h = im.size
    max_w = 640
    if w > max_w:
        im = im.resize((max_w, int(h * max_w / w)), Image.Resampling.LANCZOS)
    im.save(p, "PNG", optimize=True)
    save_info(p)

# 3) Mapa cobertura -> JPG
cov = base / "cobertura-regional-lcs.png"
if cov.exists():
    im = Image.open(cov).convert("RGB")
    w, h = im.size
    if w > 1200:
        im = im.resize((1200, int(h * 1200 / w)), Image.Resampling.LANCZOS)
    out = base / "cobertura-regional-lcs.jpg"
    im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    save_info(out)

# 4) Recomprimir webp grandes de proyectos
proj = base / "proyectos"
for p in proj.glob("*.webp"):
    if p.stat().st_size < 180_000:
        continue
    im = Image.open(p).convert("RGB")
    w, h = im.size
    if w > 1200:
        im = im.resize((1200, int(h * 1200 / w)), Image.Resampling.LANCZOS)
    im.save(p, "WEBP", quality=72, method=6)
    save_info(p)

print("DONE")
