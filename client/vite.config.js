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
        theme_color: "#1c2321",
        background_color: "#1c2321",
        display: "standalone",
      },
      includeAssets: ["/error"],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-domain\.com\/graphql/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
            },
          },
          {
            urlPattern: /\.(css|woff|woff2|ttf|otf)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "css-font-cache",
            },
          },
          {
            urlPattern: /\.js$/,
            handler: "CacheFirst",
            options: {
              cacheName: "js-cache",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/icon/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "material-icons-cache",
            },
          },
        ],
      },
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
