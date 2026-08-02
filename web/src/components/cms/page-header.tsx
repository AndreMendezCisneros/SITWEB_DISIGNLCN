export function CmsPageHeader({
  title,
  description,
  readOnly = false,
}: {
  title: string;
  description?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-[1.75rem]">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">{description}</p>
      ) : null}
      {readOnly ? (
        <p className="cms-pill mt-3 bg-amber-50 text-amber-800 ring-1 ring-amber-200/60">
          Solo lectura para tu rol
        </p>
      ) : null}
    </div>
  );
}
