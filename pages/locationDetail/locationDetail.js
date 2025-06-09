const app = getApp()
Page({
  data: {
    equipmentList: []
  },

  onLoad() {
    this.getLocationDetail()
  },
  getLocationDetail() {
    const data = {
      userName: app.globalData.userInfo.userName
    }
    console.log("14:",data)
    my.request({
      url: '/system/user/profile/queryLocationList',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}` // 使用Bearer令牌进行认证
      },
      method: 'GET',
      data: data,
      success: (response) => {
        console.log(response)
        if (response.code === 200) {
          console.log("成功：", response.data)
        }
      },
      fail: (error) => {
        console.error("错误：", error)
      }
    });
  },

  viewDetails(e) {
    const id = e.currentTarget.dataset.id;
    my.navigateTo({
      url: '/pages/materialDetail/materialDetail?id=' + id
    });
  },

  handleClaim() {
    my.showToast({
      title: '已领取',
      icon: 'success'
    });
  },

  handleReturn() {
    my.showToast({
      title: '已归还',
      icon: 'success'
    });
  }
});
