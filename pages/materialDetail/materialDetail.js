const app = getApp()
Page({
  data: {
    // 模拟数据
   material:{}
  },

  // 执勤状态开关
  toggleDuty(e) {
    this.setData({
      onDuty: e.detail.value
    });
  },

  onLoad: function (options) {
  
    if (options.id) {
      // 从 options 中获取 id 参数
      this.setData({
        materialId: options.id
      });
      console.log('receivedId:' + this.data.materialId)
    
    }
    this.getMaterial()

    // 你可以在这里也初始化一些其他数据，比如默认的装备列表
    // this.initEquipmentList(); // 这也是一个假设的方法
  },

  getMaterial(){
    const data = parseInt(this.data.materialId,10)
    console.log("当前材料id：",data)
     my.request({
      url: `/wms/material/${data}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      params: data,// 将请求数据转换为 JSON 字符串
      success: (response) => {
        console.log("当前信息：", response.data);
        const data = response.data.data;
        this.setData({
          material: data
        });
      },
      fail: (error) => {
        console.error("获取数据失败：", error);
      }
    });
  },
  // 显示巡检页面
  showInspectionPage() {
    my.navigateTo({
      url: '/pages/inspection/inspection'
    });
  },

  // 显示是否报废
  showScrap() {
    my.showModal({
      title: '报废申请',
      content: '同一批物品批量报废',
      'showCancel' : false
    });
  },

  // 显示维修页面
  showMaintenancePage() {
    my.navigateTo({
      url: '/pages/maintenance/maintenance'
    });
  },

  // 显示保养页面
  showUpKeepPage() {
    my.navigateTo({
      url: '/pages/upkeep/upkeep'
    });
  },

  // 转跳评价页面
  navigateToReview() {
    my.navigateTo({
      url: '/pages/review/review'
    });
  }
});
