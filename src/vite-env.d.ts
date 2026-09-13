/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_AUTH_TOKEN?: string;
  readonly VITE_FORCE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
