import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

const stubScssPlugin = () => ({
  name: 'stub-scss',
  enforce: 'pre' as const,
  resolveId(id: string) {
    if (id.endsWith('.scss')) {
      return id
    }
    return null
  },
  load(id: string) {
    if (id.endsWith('.scss')) {
      return 'export default {}'
    }
    return null
  },
})

export default defineConfig({
  plugins: [stubScssPlugin(), tsconfigPaths(), react()],
  test: {
    server: {
      deps: {
        inline: ['@payloadcms/ui'],
      },
    },
    environment: 'jsdom',
    fileParallelism: false,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'tests/int/**/*.int.spec.ts',
      'tests/integration/**/*.test.ts',
      'tests/unit/**/*.test.{ts,tsx}',
    ],
  },
})
