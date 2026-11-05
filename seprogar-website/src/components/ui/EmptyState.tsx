export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-theme bg-surface/70 px-6 py-10 text-center">
      <p className="font-display text-lg font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted max-w-md mx-auto">{description}</p> : null}
    </div>
  );
}
