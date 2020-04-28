module.exports = {
  // 配置如果当前时开发阶段，入口文件就为prod,反之
  chainWebpack: config => {
      // 发布模式
      config.when(process.env.NODE_ENV === 'production', config => {
        config
          .entry('app')
          .clear()
          .add('./src/main-prod.js')
          config.set('externals', {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              axios: 'axios',
              lodash: '_',
              echarts: 'echarts',
              nprogress: 'NProgress',
              'vue-quill-editor': 'VueQuillEditor'
          })
          config.plugin('html').tap(args => {
            // 如果是发布阶段为true，使用cdn加载
            args[0].isProd = true
            return args
          })
      })
    
        // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
          // 如果是开发模式，不使用cdn
          args[0].isProd = false
          return args
      })
    })
  }
}