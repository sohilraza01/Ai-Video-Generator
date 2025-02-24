import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./config/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_84dxRPfbwilV@ep-gentle-fire-a82tm3zx-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
  },
});
