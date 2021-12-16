const webpack = require('webpack')
const WebpackZipPlugin = require('webpack-zip-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'
const productionGzipExtensions = ['html', 'js', 'css']

function resolve(dir) {
    return path.join(__dirname, dir)
}

const m3config = require("@wecise/m3js/mbase/vue.config")

module.exports = m3config({
    devServer: {
        port: 8080,
        contentBase: [
            path.join(__dirname, "public"), //追加本文件所在目录下的public目录
        ],
        proxy: {
            "/static": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/user": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/matrix": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/script": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/web": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/config": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/fs": {
                target: `http://${process.env.VUE_APP_M3_HOST}`,
            },
            "/matrix/files": {
                target: `http://${process.env.VUE_APP_M3_HOST}//matrix/files`,
            },
            "/matrix/system": {
                target: `http://${process.env.VUE_APP_M3_HOST}//matrix/system`,
            },
            "/help":{
                target: `http://${process.env.VUE_APP_M3_HOST}/help`
            },
            "/mxobject":{
                target: `http://${process.env.VUE_APP_M3_HOST}`
            },
            "/consolelog":{
                target: `http://${process.env.VUE_APP_M3_HOST}`
            }
        }
    },

    outputDir: 'app/matrix/' + process.env.VUE_APP_M3_APP,
    productionSourceMap: false,

    configureWebpack: {
        entry: {
            app: "./src/main.js"
        }
    },

    chainWebpack(config) {

        // ============压缩图片 start============
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end()
        // ============压缩图片 end============

        // set svg-sprite-loader
        config.module
          .rule('svg')
          .exclude.add(resolve('src/icons'))
          .end()
        config.module
          .rule('icons')
          .test(/\.svg$/)
          .include.add(resolve('src/icons'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          })
          .end()

          /* config
            .plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin) */
    },

    publicPath: process.env.NODE_ENV === 'production'?'/static/app/matrix/'+process.env.VUE_APP_M3_APP:''
})