'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'New()' // page title

/* // 如果您的端口设置为 80，
使用管理员权限执行命令行。
例如，Mac：sudo npm run
您可以通过以下方法更改端口： */
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * 如果您计划在子路径下部署站点，则需要设置 publicPath，
   * 例如 GitHub Pages。如果您计划将站点部署到 https://foo.github.io/bar/，
   * 则 publicPath 应设置为 “/bar/”。
   * 在大多数情况下，请使用“/”!!!
   * 详细说明：https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  /*   lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false, */
  lintOnSave:false,

  devServer: {
    port: 9528,
    open: true,
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '/dev': {
        target: 'http://localhost:9528/', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 开启跨域 ：本地就会虚拟一个服务器接收你的请求并代你发送该请求。
        // ws: true, // websockets
        // secure: false, // https协议才设置
        pathRewrite: {
          // pathRewrite方法重写url
          '^/dev': '/'
        }
      }
    }

    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // 在 webpack 的名称字段中提供应用的标题，以便
    // 可以在索引中访问它.html以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // 它可以提高第一屏的速度，建议打开预紧力
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 当有很多页面时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

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
      config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 仅最初依赖的软件包第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将元素 UI 拆分为单个包
                  priority: 20, // 重量需要大于 lib 和 app，否则将被打包到 lib 或 app 中
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
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
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
