/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: [
    "tesseract.js",
    "tesseract.js-core",
    "wasm-feature-detect",
    "node-fetch",
  ],
};

export default nextConfig;
