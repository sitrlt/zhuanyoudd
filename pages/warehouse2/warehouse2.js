const app = getApp()
Page({
  data: {
    wmsNum:null,
    storagelocationName: null,
    foamGuns: [],
    currentPage: 1, // 当前页码
    pageSize: 10, // 每页数量
    totalPages: 1, // 总页数
    totalCount: 0, // 总数据量
    receivedId: null, // 用于存储接收到的 id 参数
    deptName:null
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        receivedId: options.id,
        storagelocationName: app.globalData.storagelocationName,
        deptName:app.globalData.deptName
      });
      console.log(this.data.receivedId)
      this.getEquipmentById(options.id);
      this.getWmsNum(options.id)
    }
  },

  getEquipmentById: function (id) {
    const { currentPage, pageSize } = this.data;
    const deptId = app.globalData.userInfo.deptId;
    const data = {
      storagelocationId: parseInt(id, 10)
    }
    my.request({
      url: '/wms/commodity/listByStockin',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      data:JSON.stringify(data),// 将请求数据转换为 JSON 字符串
      success: (response) => {
        console.log("当前信息：", response.data);
        const data = response.data.rows;
        this.setData({
          foamGuns: data
        });
      },
      fail: (error) => {
        console.error("获取数据失败：", error);
      }
    });
  },
  getWmsNum:function(id){
    const data = {
      storagelocationId: parseInt(id, 10),
    }
    my.request({
      url: '/wms/commodity/totalNum',
      method: 'GET',
     headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      data: data,// 将请求数据转换为 JSON 字符串
      success: (response) => {
        console.log("当前信息：", response.data);
        this.setData({wmsNum:response.data.data.invQuantitys})
      },
      fail: (error) => {
        console.error("获取数据失败：", error);
      }
    });
  },

  handleLinkTap(e) {
    // 获取当前点击的行数据
    const currentItem = e.currentTarget.dataset.item;
    
    // 存储到全局变量（示例：app.globalData.clickedItem）
    app.globalData.foamGunsItem = currentItem;
    console.log('全局存储的点击数据：', app.globalData.foamGunsItem);
  },

});