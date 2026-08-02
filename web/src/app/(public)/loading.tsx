export default function PublicLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-lcs-black">
      <div className="h-1 w-32 overflow-hidden rounded bg-white/10">
        <div className="h-full w-1/2 animate-pulse bg-lcs-gold" />
      </div>
    </div>
  );
}
