import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          {title}
        </h2>
        {description ? <div className="mt-1.5 text-sm text-muted max-w-2xl leading-relaxed">{description}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className = '',
  title,
  description,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-theme bg-surface shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)] ${className}`}
    >
      {title ? (
        <div className="border-b border-theme px-5 py-4 md:px-6">
          <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
          {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
        </div>
      ) : null}
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

export function AdminAlert({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'success' | 'warning' | 'info';
  children: ReactNode;
}) {
  const styles = {
    error: 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300',
    success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
    warning: 'border-amber-500/25 bg-amber-500/10 text-amber-900 dark:text-amber-200',
    info: 'border-[#F37021]/25 bg-[#F37021]/10 text-foreground',
  }[tone];

  return (
    <p className={`rounded-xl border px-3.5 py-2.5 text-sm ${styles}`} role="alert">
      {children}
    </p>
  );
}

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-theme bg-surface-elevated px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition focus:border-[#F37021]/50 focus:ring-2 focus:ring-[#F37021]/25';

export function AdminField({
  label,
  hint,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`block text-sm font-medium text-foreground ${className}`}>
      <span className="block">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs font-normal text-muted">{hint}</span> : null}
    </div>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input {...rest} className={`${fieldClass} ${className}`} />;
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return <textarea {...rest} className={`${fieldClass} resize-y min-h-[96px] ${className}`} />;
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', ...rest } = props;
  return <select {...rest} className={`${fieldClass} ${className}`} />;
}

export function AdminSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-theme bg-surface-elevated px-4 py-3 text-left transition hover:border-[#F37021]/35"
    >
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-muted">{description}</span> : null}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? 'bg-[#F37021]' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

export function AdminButton({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'brand';
}) {
  const variants = {
    brand: 'bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white shadow-brand hover:brightness-105',
    primary: 'bg-[#000336] text-white hover:bg-[#0F4C81] dark:bg-[#F37021] dark:hover:brightness-110',
    secondary:
      'border border-theme bg-surface-elevated text-foreground hover:border-[#F37021]/40 hover:text-[#F37021]',
    ghost: 'text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5',
    danger: 'border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400',
  }[variant];

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants} ${className}`}
    />
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        published
          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
          : 'bg-slate-500/15 text-muted'
      }`}
    >
      {published ? 'Publicado' : 'Borrador'}
    </span>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-theme bg-surface shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)]">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted bg-surface-elevated/80 ${className}`}
    >
      {children}
    </th>
  );
}

export function AdminTd({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 border-t border-theme text-foreground ${className}`}>{children}</td>;
}

export function IconActionButton({
  label,
  onClick,
  tone = 'neutral',
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: 'neutral' | 'danger';
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex rounded-lg p-2 transition ${
        tone === 'danger'
          ? 'text-red-600 hover:bg-red-500/10 dark:text-red-400'
          : 'text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}
