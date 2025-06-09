Page({
  data: {
      message: 'aaaaa',
      text:''
  },
  changeText() {
        this.setData({
            text: 'changed data'
        })
    },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
 // 发起请求
    my.httpRequest({
      url:"",
      success: (res) => {
        console.info(res);  // 输出响应数据到控制台
        
        // 使用 setData 更新 message 的内容
        this.setData({
          message: JSON.stringify(res.data)  // 将响应结果转换为字符串并更新页面数据
        });
      },
      fail: (err) => {
        console.error('Request failed', err);  // 请求失败时输出错误信息
              // 设置 message 为错误提示信息
        this.setData({
          message: '请求失败，请检查网络连接或接口地址'
        });
      }
    });
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  go() {
      // 带参数的跳转，从 page/index 的 onLoad 函数的 query 中读取 xx
      // my.navigateTo({url : '/pages/test/test'})
      my.navigateTo({url : '/pages/login/login'})

  },
});
