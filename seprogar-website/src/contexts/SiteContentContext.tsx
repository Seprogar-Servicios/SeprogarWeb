import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchPublicSiteContent } from '../lib/api/content';
import { FALLBACK_SITE_CONTENT } from '../lib/fallbackContent';
import type { PublicSiteContent } from '../types/content';

type SiteContentContextValue = {
  content: PublicSiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PublicSiteContent>(FALLBACK_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchPublicSiteContent();
      setContent(next);
    } catch {
      setContent(FALLBACK_SITE_CONTENT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ content, loading, refresh }), [content, loading, refresh]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent debe usarse dentro de SiteContentProvider');
  return ctx;
}
