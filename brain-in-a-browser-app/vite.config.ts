import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

function normalizeBasePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const requestedBasePath = process.env.BASE_PATH
  const productionBasePath =
    requestedBasePath || (repositoryName ? `/${repositoryName}/` : '/brain-in-a-browser/')

  return {
    base: mode === 'production' ? normalizeBasePath(productionBasePath) : '/',
    plugins: [react(), tailwindcss()],
  }
})
