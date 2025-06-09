Page({
  data: {
     userInfo: {},

  },
  onLoad: function () {
        // 获取 App 实例
        const app = getApp();
        console.log("个人信息：",app.globalData.userInfo)
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo
            });
        }
    },
  // 保存个人信息
  saveProfile() {
    my.showToast({
      content: "保存成功",
      type: "success",
      duration: 2000
    });
  },

  // 查看个人货位
  viewLocation() {
    my.navigateTo({
      url: "/pages/locationDetail/locationDetail"
    });
  }
});
