import { useEffect, useId, useMemo, useState } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { getPublicMediaUrl } from '../../lib/supabase';

type BaseProps = {
  label?: string;
  hint?: string;
  accept?: string;
};

type SingleProps = BaseProps & {
  multiple?: false;
  /** Path en storage o URL pública existente */
  existingPath?: string | null;
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Quitar imagen ya guardada (sin archivo nuevo seleccionado) */
  onClearExisting?: () => void;
  shape?: 'rect' | 'circle';
};

type MultiProps = BaseProps & {
  multiple: true;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

type Props = SingleProps | MultiProps;

function revokeAll(urls: string[]) {
  urls.forEach((u) => URL.revokeObjectURL(u));
}

export function ImageUploader(props: Props) {
  const inputId = useId();
  const accept = props.accept ?? 'image/jpeg,image/png,image/webp,image/gif';
  const label = props.label ?? 'Imagen';
  const hint = props.hint ?? 'JPEG, PNG, WebP o GIF · máx. 5 MB';

  if (props.multiple) {
    return <MultiUploader {...props} inputId={inputId} accept={accept} label={label} hint={hint} />;
  }

  return <SingleUploader {...props} inputId={inputId} accept={accept} label={label} hint={hint} />;
}

function SingleUploader({
  inputId,
  accept,
  label,
  hint,
  existingPath,
  file,
  onFileChange,
  onClearExisting,
  shape = 'rect',
}: SingleProps & { inputId: string; accept: string; label: string; hint: string }) {
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setLocalUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const preview = localUrl ?? getPublicMediaUrl(existingPath) ?? null;
  const isCircle = shape === 'circle';

  function clearPreview() {
    if (file) {
      onFileChange(null);
      return;
    }
    onClearExisting?.();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted mt-0.5">{hint}</p>
        </div>
        {preview && (file || onClearExisting) ? (
          <button
            type="button"
            onClick={clearPreview}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {file ? 'Quitar selección' : 'Quitar imagen'}
          </button>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div
          className={`relative overflow-hidden border border-theme bg-surface-elevated ${
            isCircle
              ? 'h-28 w-28 rounded-full'
              : 'aspect-[3/2] w-full max-w-[220px] rounded-2xl'
          }`}
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[112px] w-full flex-col items-center justify-center gap-1 text-muted">
              <ImagePlus className="h-7 w-7 opacity-50" />
              <span className="text-[11px]">Sin imagen</span>
            </div>
          )}
        </div>

        <label
          htmlFor={inputId}
          className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-theme bg-surface-elevated/60 px-4 py-6 text-center transition hover:border-[#F37021]/50 hover:bg-[#F37021]/5"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F37021]/15 text-[#F37021]">
            <Upload className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold text-foreground">
            {preview ? 'Cambiar imagen' : 'Subir imagen'}
          </span>
          <span className="text-xs text-muted">Arrastrá acá o hacé clic para elegir</span>
          <input
            id={inputId}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {file ? (
        <p className="text-xs text-muted">
          Nueva: <span className="text-foreground font-medium">{file.name}</span> (
          {(file.size / 1024).toFixed(0)} KB)
        </p>
      ) : null}
    </div>
  );
}

function MultiUploader({
  inputId,
  accept,
  label,
  hint,
  files,
  onFilesChange,
}: MultiProps & { inputId: string; accept: string; label: string; hint: string }) {
  const previews = useMemo(
    () => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [files],
  );

  useEffect(() => {
    return () => revokeAll(previews.map((p) => p.url));
  }, [previews]);

  function removeAt(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted mt-0.5">{hint}</p>
      </div>

      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-theme bg-surface-elevated/60 px-4 py-8 text-center transition hover:border-[#F37021]/50 hover:bg-[#F37021]/5"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F37021]/15 text-[#F37021]">
          <Upload className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-foreground">Agregar fotografías</span>
        <span className="text-xs text-muted">Podés seleccionar varias a la vez</span>
        <input
          id={inputId}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const list = e.target.files;
            if (!list?.length) return;
            onFilesChange([...files, ...Array.from(list)]);
            e.target.value = '';
          }}
        />
      </label>

      {previews.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((item, index) => (
            <div key={`${item.file.name}-${index}`} className="relative group">
              <img
                src={item.url}
                alt={item.file.name}
                className="aspect-square w-full rounded-xl object-cover border border-theme"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-2 right-2 rounded-full bg-surface/95 p-1.5 text-red-600 shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                aria-label={`Quitar ${item.file.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <p className="mt-1 truncate text-[11px] text-muted">{item.file.name}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
