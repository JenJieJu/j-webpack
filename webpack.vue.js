const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    hotReload: true
                }
            },
            {
                test: /\.(css|scss|less)$/,
                use: [{
                    loader: 'vue-style-loader'
                }]
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['.js', '.vue']
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
}