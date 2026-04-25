import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "node tools/static-server.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://127.0.0.1:4173"
  }
});
