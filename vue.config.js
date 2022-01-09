const path = require('path')
const glob = require('glob')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const HappyPack = require('happypack')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer')
const port = process.env.port || process.env.npm_config_port || 8888
const name = '健康码管理' // page title
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'js-cookie': 'Cookies'
}

const PATHS = {
  src: path.join(__dirname, 'src')
}

// 记录打包速度
const smp = new SpeedMeasurePlugin()

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  publicPath: "/mobile/",
  outputDir: 'mobile',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://10.183.39.11:8080/base-app`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
  },
  configureWebpack: smp.wrap({
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'), // 主目录
        views: resolve('src/views'), // 页面
        components: resolve('src/components'), // 组件
        api: resolve('src/api'), // 接口
        utils: resolve('src/utils'), // 通用功能
        assets: resolve('src/assets'), // 静态资源
        style: resolve('src/style') // 通用样式
      }
    }
  }),
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config
      .when(process.env.NODE_ENV === 'development', config =>
        config.devtool('cheap-source-map')
      )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          inline: /runtime\..*\.js$/
        }])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
    if (IS_PRODUCTION) {
      config.plugin('analyzer').use(BundleAnalyzerPlugin)
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
      config.externals(externals)
      config.plugin('html').tap(args => {
        args[0].minify.minifyCSS = true // 压缩html中的css
        return args
      })

      // 多线程
      config.plugin('HappyPack').use(HappyPack, [{
        loaders: [{
          loader: 'babel-loader?cacheDirectory=true'
        }]
      }])
      // gzip需要nginx进行配合
      config
        .plugin('compression')
        .use(CompressionWebpackPlugin)
        .tap(() => [{
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 超过10k进行压缩
          deleteOriginalAssets: false // 是否删除源文件
        }])

      // css Tree Thaking
      config.plugin('purecss').use(
        new PurgecssPlugin({
          paths: glob.sync(`${PATHS.src}/**/*`, {
            nodir: true
          })
        })
      )
      config.optimization.minimizer([
        new UglifyjsWebpackPlugin({
          // 生产环境推荐关闭 sourcemap 防止源码泄漏
          // 服务端通过前端发送的行列，根据 sourcemap 转为源文件位置
          // sourceMap: true,
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        })
      ])
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!IS_PRODUCTION,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
    loaderOptions: {
      sass: {
        data: '@import "style/_mixin.scss";@import "style/_variables.scss";@import "style/common.scss";' // 全局引入
      }
    }
  },
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },

}


function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/imports.styl'),
      ],
    })
}
