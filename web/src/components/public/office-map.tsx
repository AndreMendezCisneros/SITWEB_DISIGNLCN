/** Mapa de la oficina. Embed OSM (sin API key / sin bloqueos típicos de Maps JS). */
export function OfficeMap({
  address,
  className = "",
}: {
  address: string;
  className?: string;
}) {
  const query = encodeURIComponent(address);
  // Link Tower — Av. Manuel Olguín 335, Surco (aprox.)
  const lat = -12.11135;
  const lng = -76.99105;
  const delta = 0.008;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  const openGoogle = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const openOsm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

  return (
    <section className={className}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lcs-gold">
            Ubicación
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase text-lcs-white">
            Cómo llegar
          </h2>
          <p className="mt-2 max-w-xl text-sm text-lcs-muted">{address}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={openGoogle}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-lcs-gold px-5 py-3 text-sm font-semibold uppercase tracking-wider text-lcs-black transition hover:bg-lcs-gold-soft"
          >
            <span aria-hidden className="text-base leading-none">
              ↗
            </span>
            Abrir en Google Maps
          </a>
          <a
            href={openOsm}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center border border-white/25 px-4 py-3 text-sm text-white/80 transition hover:border-lcs-gold hover:text-lcs-gold"
          >
            OpenStreetMap
          </a>
        </div>
      </div>
      <div className="relative aspect-[21/9] min-h-[240px] overflow-hidden border border-white/10 bg-lcs-black">
        <iframe
          title={`Mapa de la oficina: ${address}`}
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
