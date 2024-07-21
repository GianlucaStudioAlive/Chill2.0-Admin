import JavaScriptObfuscator from 'webpack-obfuscator';
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { dev, isServer }) {
        if (!dev) {
          // Disable source maps in production
          config.devtool = false;
          
          // Add JavaScript obfuscation
          config.plugins.push(
            new JavaScriptObfuscator({
              rotateUnicodeArray: true,
              // You can add more options to customize the obfuscation
            }, ['excluded_bundle_name.js']) // Exclude specific bundles if needed
          );
        }
    
        return config;
      },
};

export default nextConfig;
