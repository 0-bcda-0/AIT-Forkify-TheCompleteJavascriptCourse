const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // boble-polyfill je za starije browsere koji ne podrzavaju sve ES6 funkcije, a mi cemo ga koristiti za async/await
    // entry: ['babel-polyfill', './src/js/index.js'],
    entry: './src/js/index.js',
    output: {
        // treba biti apsolutna putanja, zato koristimo path.resolve koji nam vraca apsolutnu putanju sa __dirname
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        static: './dist', // Set the content base directory
        historyApiFallback: true, // Enable HTML5 history API fallback
        hot: true, // Enable Hot Module Replacement
        port: 8080, // Specify the port number
        // ... other dev server options ...

        // SA CHATGPTA JER JE TUTORIJAL ZASTARIO
    },
    plugins: [
        // ovaj plugin omogucuje da svaki put kada buildamo projekt, index.html se automatski generira u dist folderu
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
    /*
    module: {
        // rules je array koji sadrzi sve objekte koji opisuju kako se koji file treba transpajlati
        rules: [
            {
                test: /\.js$/, // trazit ce sve fileove koji zavrsavaju sa .js
                exclude: /node_modules/, // iskljucit ce sve fileove iz node_modules foldera, a to nezelimo zato sta su tamo tisuce filova od packageova
                use: {
                    loader: 'babel-loader' // koristit ce se babel-loader
                }
            }
        ]
    }
    */

    // Razlika izmedu disc i src:
    // dist je za distribuciju i to ide u produkciju
    // src je za development i to se kasnije kompresira i optimizira i ide u dist



    // mode: 'development' je bez kompresije, a mode: 'production' je sa kompresijom i optimizacijom
    // mode: 'development'
    // Prebaceno u package.json
    
};