/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_CLARITY: string;
  readonly VITE_CLARITY_PROJECT_ID: string;
  readonly VITE_ASSISTANT_API_BASE: string;
  readonly VITE_ASSISTANT_MODEL: string;
  readonly VITE_ASSISTANT_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
