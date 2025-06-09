Page({
  data: {
    maintenanceMethod: 'outsourced',
    maintenanceUnit: '',
    maintenanceRequirement: ''
  },

  handleMaintenanceMethodChange(e) {
    this.setData({
      maintenanceMethod: e.detail.value
    });
  },

  handleMaintenanceUnitInput(e) {
    this.setData({
      maintenanceUnit: e.detail.value
    });
  },

  handleMaintenanceRequirementInput(e) {
    this.setData({
      maintenanceRequirement: e.detail.value
    });
  },

  submitMaintenanceRequest() {
    console.log('维修请求提交，详细信息如下：', {
      method: this.data.maintenanceMethod,
      unit: this.data.maintenanceUnit,
      requirement: this.data.maintenanceRequirement
    });
    
    // 提交逻辑（例如发送到服务器）

    // 返回到上一页面
    my.navigateBack();
  }
});
