const prodplugins = []
if(process.env.NODE_ENV === 'production'){
  // 通过process.env.NODE_ENV就能获取到当前时开发模式还是发布模式，如果时发布模式就push进去
  prodplugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodplugins, //项目上线安装移除所有的console，安装依赖时选择开发依赖
    "@babel/plugin-syntax-dynamic-import"
  ]
}
