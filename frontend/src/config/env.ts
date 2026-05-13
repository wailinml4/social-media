// Central frontend env access for Vite (client-safe)
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string
  readonly VITE_FRONTEND_URL?: string
}

const raw = import.meta.env as unknown as ImportMetaEnv

export const env = {
  VITE_BACKEND_URL: raw.VITE_BACKEND_URL ?? 'http://localhost:3000',
  VITE_FRONTEND_URL: raw.VITE_FRONTEND_URL ?? 'http://localhost:5173',
}

export function assertClientEnv(): void {
  if (!env.VITE_BACKEND_URL) {
    throw new Error('Missing VITE_BACKEND_URL in client environment')
  }
}

export default env
