import {
  CalendarCheck,
  Clock3,
  MessageCircle,
  ShieldCheck,
  ThumbsUp,
  Users2,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  message: MessageCircle,
  calendar: CalendarCheck,
  wrench: Wrench,
  thumbs: ThumbsUp,
  shield: ShieldCheck,
  clock: Clock3,
  users: Users2,
};

export const SECTION_ICON_OPTIONS = [
  { value: 'message', label: 'Mensaje' },
  { value: 'calendar', label: 'Calendario' },
  { value: 'wrench', label: 'Herramienta' },
  { value: 'thumbs', label: 'OK' },
  { value: 'shield', label: 'Escudo' },
  { value: 'clock', label: 'Reloj' },
  { value: 'users', label: 'Personas' },
  { value: '', label: 'Sin ícono' },
] as const;

export function getSectionIcon(key?: string | null): LucideIcon | null {
  if (!key) return null;
  return ICONS[key] ?? null;
}
