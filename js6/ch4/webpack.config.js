const path = require('path')

module.exports = {
    entry: './index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'public/dist')
    },
    module: {
        rules: [
            { // This section tells Webpack to use Babel to translate your React into Javascript
                test: /\.js$/, // Regex for JS files
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    'presets': ['@babel/preset-react']
                }
            }
        ]
    }
}