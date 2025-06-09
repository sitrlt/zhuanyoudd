Page({
  data: {
    isDutyActive: true,
    showMaintenance: false, // 控制维修页面的显示
    maintenanceMethod: 'outsourced',
    maintenanceUnit: '',
    maintenanceRequirement: ''
  },

  // 切换执勤状态
  toggleDutyStatus() {
    this.setData({
      isDutyActive: !this.data.isDutyActive
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

  onEvaluate() {
    my.navigateTo({
      url: '/pages/equipmentDetail/equipmentDetail'
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

  // 维修方式选择处理
  handleMaintenanceMethodChange(e) {
    this.setData({
      maintenanceMethod: e.detail.value
    });
  },

  // 处理维修单位输入
  handleMaintenanceUnitInput(e) {
    this.setData({
      maintenanceUnit: e.detail.value
    });
  },

  // 处理维修需求输入
  handleMaintenanceRequirementInput(e) {
    this.setData({
      maintenanceRequirement: e.detail.value
    });
  },

  // 提交维修请求
  submitMaintenanceRequest() {
    console.log('维修请求提交，详细信息如下：', {
      method: this.data.maintenanceMethod,
      unit: this.data.maintenanceUnit,
      requirement: this.data.maintenanceRequirement
    });
    // 在这里添加代码以将请求发送到服务器（如果需要）
    // 提交后隐藏维修页面
    this.setData({
      showMaintenance: false
    });
  }
});
