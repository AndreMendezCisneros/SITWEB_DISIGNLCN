import Image from "next/image";

/** Muestra imagen CMS o un placeholder indicando que se puede cambiar desde admin. */
export function ImageSlot({
  src,
  alt,
  label = "Imagen editable desde Admin → Multimedia / módulo",
  className = "",
  aspect = "aspect-[16/10]",
}: {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  aspect?: string;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-neutral-200 ${aspect} ${className}`}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      </div>
    );
  }

  return (
    <div
      className={`flex ${aspect} flex-col items-center justify-center border border-dashed border-lcs-gold/50 bg-neutral-100 px-4 text-center ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lcs-gold">
        Espacio para imagen
      </p>
      <p className="mt-2 max-w-xs text-sm text-neutral-500">{label}</p>
    </div>
  );
}
