import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import dotenv from "dotenv";
import webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.resolve("src/index.tsx"),
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },

            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ["@svgr/webpack"],
            },

        ],
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "./src"),
            path.resolve(__dirname, "."),
            "node_modules",
        ],
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    mode: "development",
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env),
        }),
        new CompressionPlugin({
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            filename: "index.html",
        }),
    ],
};
