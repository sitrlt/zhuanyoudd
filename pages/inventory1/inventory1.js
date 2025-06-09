const app = getApp()
Page({
  data: {
    foamGunsItem:null,
    item:null,
    wmsNum: null,
    foamGuns: [],
    currentPage: 1, // 当前页码
    pageSize: 10, // 每页数量
    totalPages: 1, // 总页数
    totalCount: 0, // 总数据量
    materialtypeld: null // 用于存储接收到的 id 参数
  },

  onLoad: function (options) {
    console.log("当前options16：",options)
    if (options.id) {
      this.setData({
        materialtypeld: options.id,
        item: app.globalData.item,
      });
      console.log(this.data.materialtypeld)
      this.getEquipmentById(options.id);
    }
  },

  getEquipmentById: function (id) {
    const { currentPage, pageSize } = this.data;
    const data = {
      deptIds:app.globalData.deptIds,
      materialtypeld: parseInt(id, 10),
      pageSize: pageSize,
      pageNum: currentPage
    }
    console.log("当前inventory1的data：",data)
    my.request({
      url: '/wms/commodity/listByStockin',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      data: JSON.stringify(data),// 将请求数据转换为 JSON 字符串
      success: (response) => {
        console.log("过滤后的库存数据：", response.data);
        const data = response.data.rows || [];
        const totalCount = response.data.total || 0;
        this.setData({
          foamGuns: data,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        });
      },
      fail: (error) => {
        console.error("获取数据失败：", error);
      }
    });
  },
  // 分页相关方法
  prevPage() {
    const { currentPage } = this.data;
    if (currentPage > 1) {
      this.setData({
        currentPage: currentPage - 1
      });
      this.getEquipmentById();
    }
  },

  nextPage() {
    const { currentPage, totalPages } = this.data;
    if (currentPage < totalPages) {
      this.setData({
        currentPage: currentPage + 1
      });
      this.getEquipmentById();
    }
  },
 handleLinkTap(e) {
    // 获取当前点击的行数据
    const currentItem = e.currentTarget.dataset.item;
    
    // 存储到全局变量（示例：app.globalData.clickedItem）
    app.globalData.foamGunsItem = currentItem;
    console.log('全局存储的点击数据：', app.globalData.foamGunsItem);
  },
});