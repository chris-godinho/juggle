import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Define PWA settings
    VitePWA({
      manifest: {
        name: "Juggler",
        short_name: "Juggler",
        description: "A task management app with a focus on work/life balance.",
        start_url: "/",
        display: "standalone",
        background_color: "#1c2321",
        theme_color: "#1c2321",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      }
    }),
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/graphql": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
