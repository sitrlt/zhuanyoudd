const app = getApp()
Page({
  data: {
    foamGunsItem: null,
    warehouseItems: [],
    materialtypeId: null // 用于存储接收到的 id 参数
  },

  onLoad: function (options) {

    if (options.id) {
      // 从 options 中获取 id 参数
      this.setData({
        materialtypeId: options.id,
        foamGunsItem: app.globalData.foamGunsItem
      });
      console.log("当前数据foamGunsItem：", this.data.foamGunsItem)
      // 检查 type 参数
      if (options.type === 'list') {
        console.log('从详情页面跳转过来');
        const data = {
          materialtypeId: parseInt(this.data.materialtypeId, 10),
          storagelocationId: app.globalData.storagelocationId
        }
        this.getEquipmentById(data);

      } else if (options.type === 'details') {
        console.log('从列表页面跳转过来');
        const data = {
          materialtypeId: parseInt(this.data.materialtypeId, 10),
          producersId: parseInt(this.data.foamGunsItem.producersId, 10)
        }
        this.getEquipmentById(data);

      }
    }

  },

  // 用于根据 id 获取装备信息
  getEquipmentById: function (data) {
    console.log("当前数据w3：", data)
    my.request({
      url: '/wms/material/list',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      data: data,// 将请求数据转换为 JSON 字符串
      success: (response) => {
        console.log("当前信息：", response.data);
        const data = response.data.rows;
        this.setData({
          warehouseItems: data
        });
      },
      fail: (error) => {
        console.error("获取数据失败：", error);
      }
    });
  },

});