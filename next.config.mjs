/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでNode.jsモジュールを使用しないようにする
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        child_process: false,
        'fs/promises': false,
        stream: false,
        util: false,
        events: false,
        'string_decoder': false,
        url: false,
        fsevents: false,
      };
      
      // fseventsモジュールを完全に無視する
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /fsevents\.node$/,
        use: 'null-loader',
        // または単純に無視する
        // use: 'ignore-loader',
      });
    }
    return config;
  },
}

export default nextConfig
