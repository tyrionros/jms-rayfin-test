import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode from process.env and .env files
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Allow Vite to pick up AZURE_ prefixed variables alongside VITE_
    envPrefix: ['VITE_', 'AZURE_'],

    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },

    // Inject Azure AI Foundry variables directly into the build execution context
    define: {
      'import.meta.env.VITE_AZURE_AI_FOUNDRY_API_KEY': JSON.stringify(
        process.env.AZURE_AI_FOUNDRY_API_KEY ||
        process.env.VITE_AZURE_AI_FOUNDRY_API_KEY ||
        env.AZURE_AI_FOUNDRY_API_KEY ||
        env.VITE_AZURE_AI_FOUNDRY_API_KEY ||
        ''
      ),
      'import.meta.env.VITE_AZURE_AI_FOUNDRY_ENDPOINT': JSON.stringify(
        process.env.AZURE_AI_FOUNDRY_ENDPOINT ||
        process.env.VITE_AZURE_AI_FOUNDRY_ENDPOINT ||
        env.AZURE_AI_FOUNDRY_ENDPOINT ||
        env.VITE_AZURE_AI_FOUNDRY_ENDPOINT ||
        ''
      ),
    },

    build: {
      target: 'es2022',
    },
    esbuild: {
      target: 'es2022',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2022',
      },
    },
  };
});
