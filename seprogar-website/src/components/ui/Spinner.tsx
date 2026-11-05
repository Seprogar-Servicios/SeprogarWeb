export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-600" role="status">
      <div className="h-10 w-10 rounded-full border-4 border-[#F37021]/30 border-t-[#F37021] animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
