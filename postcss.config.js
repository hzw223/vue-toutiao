// 配置postcss将px转为rem
module.exports = {
  plugins: {
    // 浏览器兼容的配置，vue默认已经配置好了
    // vuecli通过package.json中的browserslist配置来配置要兼容的浏览器信息
    // 'autoprefixer': {
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 将px转为rem
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
