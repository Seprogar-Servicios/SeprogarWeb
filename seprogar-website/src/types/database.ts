import type { ReactNode } from 'react';

export type Especialidad = {
  id: string;
  nombre: string;
  slug: string;
  descripcion_breve: string | null;
  descripcion_completa: string | null;
  imagen_portada: string | null;
  orden: number;
  publicado: boolean;
  created_at: string;
  updated_at: string;
};

export type Trabajo = {
  id: string;
  especialidad_id: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
  publicado: boolean;
  created_at: string;
  updated_at: string;
};

export type Fotografia = {
  id: string;
  trabajo_id: string;
  storage_path: string;
  alt_text: string | null;
  orden: number;
  created_at: string;
};

export type Persona = {
  id: string;
  nombre: string;
  cargo: string | null;
  fotografia_path: string | null;
  orden: number;
  publicado: boolean;
  created_at: string;
  updated_at: string;
};

export type PersonaEspecialidad = {
  persona_id: string;
  especialidad_id: string;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type TrabajoConFotos = Trabajo & {
  fotografias: Fotografia[];
};

export type EspecialidadDetalle = Especialidad & {
  trabajos: TrabajoConFotos[];
  personas: Persona[];
};

export type Database = {
  public: {
    Tables: {
      especialidades: {
        Row: Especialidad;
        Insert: Partial<Especialidad> & Pick<Especialidad, 'nombre' | 'slug'>;
        Update: Partial<Especialidad>;
        Relationships: [];
      };
      trabajos: {
        Row: Trabajo;
        Insert: Partial<Trabajo> & Pick<Trabajo, 'especialidad_id' | 'titulo'>;
        Update: Partial<Trabajo>;
        Relationships: [];
      };
      fotografias: {
        Row: Fotografia;
        Insert: Partial<Fotografia> & Pick<Fotografia, 'trabajo_id' | 'storage_path'>;
        Update: Partial<Fotografia>;
        Relationships: [];
      };
      personas: {
        Row: Persona;
        Insert: Partial<Persona> & Pick<Persona, 'nombre'>;
        Update: Partial<Persona>;
        Relationships: [];
      };
      persona_especialidad: {
        Row: PersonaEspecialidad;
        Insert: Pick<PersonaEspecialidad, 'persona_id' | 'especialidad_id'>;
        Update: Partial<PersonaEspecialidad>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, 'id'>;
        Update: Partial<Profile>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
  gradient: string;
}

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface NavLinkProps {
  href: string;
  label: string;
}
