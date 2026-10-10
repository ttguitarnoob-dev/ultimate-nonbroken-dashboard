/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['web-dev.kitty-cottage.com'],
    outputFileTracingExcludes: {
        '/api/**/*': ['**/*.test.ts', '**/public/**/*'],
      },
};

module.exports = nextConfig;
