const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const config = require('./webpack.config')
const paths = require('./paths')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'

module.exports = function (proxy, allowedHost, port) {
    return {
        // Enable gzip compression of generated files.
        compress: true,
        // Enable hot reloading server. It will provide /sockjs-node/ endpoint
        // for the WebpackDevServer client so it can learn when the files were
        // updated. The WebpackDevServer client is included as an entry point
        // in the Webpack development configuration. Note that only changes
        // to CSS are currently hot reloaded. JS changes will refresh the browser.
        hot: true,
        // It is important to tell WebpackDevServer to use the same "root" path
        // as we specified in the config. In development, we always serve from /.
        static: {
            publicPath: config.output.publicPath,
            directory: paths.appPublic,
        },
        // Enable HTTPS if the HTTPS environment variable is set to 'true'
        https: protocol === 'https',
        host: host,
        client: {
            logging: 'none',
            overlay: false,
        },
        historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebookincubator/create-react-app/issues/387.
            disableDotRule: true,
        },
        allowedHosts: [allowedHost || 'localhost'],
        proxy,
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined')
            }

            // This lets us open files from the runtime error overlay.
            devServer.app.use(errorOverlayMiddleware())

            return middlewares
        },
        port,
    }
}
