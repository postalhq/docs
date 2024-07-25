// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],
  modules: [
    "@nuxt/content",
    "@nuxt/ui",
    "@nuxthq/studio",
    "@nuxtjs/fontaine",
    "@nuxtjs/google-fonts",
    "nuxt-og-image",
    "@nuxthq/studio",
    "@nuxt/image",
  ],
  colorMode: {
    preference: 'dark',
  },
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    "components:extend": (components) => {
      const globals = components.filter((c) =>
        ["UButton", "UIcon"].includes(c.pascalName)
      );

      globals.forEach((c) => (c.global = true));
    },
  },
  ui: {
    icons: ["heroicons", "simple-icons"],
  },
  // Fonts
  fontMetrics: {
    fonts: ["DM Sans"],
  },
  googleFonts: {
    display: "swap",
    download: true,
    families: {
      "DM+Sans": [400, 500, 600, 700],
    },
  },
  routeRules: {
    "/api/search.json": { prerender: true },
    "/docs": {
      redirect: { to: "/welcome/feature-list", statusCode: 302 },
    },
    "/config-v2": {
      redirect: { to: "/getting-started/configuration#legacy-configuration", statusCode: 301 },
    },
  },
  devtools: {
    enabled: true,
  },
  typescript: {
    strict: false,
  },
  uiPro: { license: "oss" },
});
