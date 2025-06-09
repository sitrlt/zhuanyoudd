Page({
  data: {
    // 模拟数据
    itemImage: '/pages/a/materia.png', // 替换为实际图片路径
    qrCodeImage: '/pages/a/qrcode.png', // 替换为实际二维码路径
    code: 'ZJ2345678908293424E07E',
    epcCode: 'E23456789082393424E07E',
    ownerUnit: '杭州西湖大队',
    storageLocation: '杭州西湖大队西湖站',
    itemStatus: '执勤',
    // 状态选择
    statusOptions: [{value: 0,name: '执勤'}, 
                    {value: 1,name: '储备'}, 
                    {value: 2,name: '备勤'},
                    {value: 3,name: '维修'},
                    {value: 4,name: '流转中'}],
    arrayIndex: 0
  },

  // 状态改变事件
  onStatusChange(e) {
    console.log('选中状态的索引值为：', e.detail.value); // 用于调试
    this.setData({
      arrayIndex: e.detail.value
    });
  },

  // 提交巡检数据
  submitInspection() {
    if (!this.data.selectedStatus) {
      my.showToast({
        title: '请先选择装备状况',
        icon: 'none'
      });
      return;
    }

    // 模拟提交数据
    my.showToast({
      title: '巡检提交成功',
      icon: 'success'
    });

    // 提交完成后可重置或跳转页面
    this.setData({
      selectedStatus: ''
    });
  }
});
