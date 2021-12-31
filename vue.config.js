module.exports = {
    // publicPath: './',
    pwa: {
        name: "swchat",
        themeColor: '#ffff',
        // appleMobileWebAppCapable: "yes",
        // appleMobileWebAppStatusBarStyle: "black",
        // workboxPluginMode: "InjectManifest",
        // workboxOptions: {
        //     // swSrc is required in InjectManifest mode.
        //     swSrc: "./src/service-worker.js",
        // }
    },
    devServer: {
        proxy: 'http://203.174.57.179:6438'
    }
}