import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
  },
  images: {
    domains: ['musiclibraryfiles.blob.core.windows.net'],  // Add the external domain here
  },
};

export default nextConfig;
