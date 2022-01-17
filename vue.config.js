module.exports = {
    // publicPath: './',
    pwa: {
        name: "swchat",
        themeColor: '#ffff',
        // pwa设置，可不使用 - start
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "#ffff",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: "./public/service-worker.js",
        }
        // - end
    },
    devServer: {
        proxy: 'https://www.swchat.xyz:3000'
    }
}