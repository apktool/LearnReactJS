const mode = process.env.BUILD_MODE ?? "standalone";
console.log("[Next] build mode", mode);

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: function (config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config
    },

    /*
    rewrites: function () {
        return [
            {
                source: '/:path*',
                destination: '/'
            }
        ]
    },
     */

    output: mode,
    images: {
        unoptimized: mode === "export",
    },

}

module.exports = nextConfig
