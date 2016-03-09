const argv = require('yargs')
    .alias('p', 'production')
    .argv;
const autoprefixer = require('autoprefixer');

const isDev = !argv.production;
const CLIENT_ROOT = `${__dirname}/client`;

module.exports = {
    debug: isDev,
    context: CLIENT_ROOT,
    entry: `./index.js`,
    output: {
        path: `${CLIENT_ROOT}/build`,
        filename: "index.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!postcss-loader!sass-loader'
        }]
    },
    postcss: () => {
        return [autoprefixer];
    }
};