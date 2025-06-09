// 1.js
const app = getApp();
Page({
  data: {
    wmsNumMap:{},
    wmsNum: null,
    equipment: [],
    // 初始化数据，可以根据需要添加其他属性
    //  equipment: [], // 假设这是你要显示的装备列表
    receivedId: null, // 用于存储接收到的 id 参数
    reservoirAreaname: null,
    storagerackName: null,
    storagelocationId: null
  },

  selectMateria2(e) {
    const id = e.currentTarget.dataset.id;
    console.log("装备id:", id)
    const selectedfoamGuns = this.data.equipment.find(c => c.storagelocationId === id);
    this.setData({ storagelocationId: id })
    console.log("当前equipment信息：", selectedfoamGuns)
    app.globalData.storagelocationName = selectedfoamGuns.storagelocationName;
    app.globalData.storagelocationId = id;
    my.navigateTo({
      url: `/pages/warehouse2/warehouse2?id=${id}`
    });
  },

  onLoad: function (options) {
    if (options.id) {
      // 从 options 中获取 id 参数
      this.setData({
        receivedId: options.id,
        reservoirAreaname: app.globalData.reservoirAreaname,
        storagerackName: app.globalData.storagerackName,
        WmsNum: app.globalData.WmsNum,
      });
      console.log(this.data.receivedId);
      this.getEquipmentById(options.id); // 这是一个假设的方法，你需要根据实际情况实现
      this.getWmsNum(options.id)
    }


  },

  // 假设的方法，用于根据 id 获取装备信息（你需要根据实际情况实现）
  getEquipmentById: function (id) {
    const storagerack = {
      storagerackId: id
    }

    my.request({
      url: '/wms/storagelocation/choiceList',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
        'Content-Type': 'application/json'
      },
      data: storagerack,
      success: (response) => {
        console.log("当前物资信息：", response.data)
        this.setData({ equipment: response.data.data });
        const rows = response.data.data || [];
        const ids = rows.map(item => item.storagelocationId); // 提取所有数据的id
        this.getWmsNumForAllIds(ids); // 调用批量获取wmsNum的方法
      },
      fail: () => {
        console.error("获取信息失败：", error);
        my.showToast({
          type: 'fail',
          content: '获取信息失败',
          duration: 1000
        });
      }
    });
  },
  getWmsNum: function (id) {
    const deptId = app.globalData.userInfo.deptId;
    const data = {
      deptId: deptId,
      storagerackId: parseInt(id, 10),
      pageNum: 1,
      pageSize: 10
    }
    my.request({
      url: '/wms/commodity/querySumWmsNum',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      data: JSON.stringify(data),// 将请求数据转换为 JSON 字符串
      success: (response) => {
        console.log("当前信息：", response.data);
        this.setData({
          wmsNum: response.data.data
        })
      },
      fail: (error) => {
        console.error("获取数据失败：", error);
      }
    });
  },
  getWmsNumForAllIds: function (ids) {
    console.log("当前ids：",ids)
    const deptId = app.globalData.userInfo.deptId;
    const wmsNumMap = {};
    const requests = ids.map(id => {
        const data = {
            deptId: deptId,
            storagelocationId: parseInt(id, 10)
        };
        return new Promise((resolve, reject) => {
            my.request({
                url: '/wms/commodity/querySumWmsNum',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${app.globalData.token}`
                },
                data: JSON.stringify(data),
                success: (response) => {
                    console.log("获取wmsNum成功：", response.data);
                    wmsNumMap[id] = response.data.data; // 存储wmsNum
                    resolve();
                },
                fail: (error) => {
                    console.error("获取wmsNum失败：", error);
                    reject(error);
                }
            });
        });
    });

    Promise.all(requests).then(() => {
        this.setData({ wmsNumMap }); // 更新页面数据
    }).catch(error => {
        console.error("批量获取wmsNum失败：", error);
    });
},

  // 其他页面的逻辑和方法...
});