
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loaders: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-syntax-dynamic-import',
                        
                        // '@babel/syntax-dynamic-import',
                        // '@babel/transform-runtime'
                    ],
                    presets: [
                        // '@babel/preset-env',
                        '@babel/react'
                    ],
                    cacheDirectory: true
                }
            },

        ]
    },
    resolve: {
        alias: {
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue']
    },
    plugins: [
    ]
}