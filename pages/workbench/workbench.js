Page({
  data: {
    taskCount: 3, // 显示任务中心的任务数
    screenHeight:null,
    safeArea:null
  },
onLoad() {
  const systemInfo = my.getSystemInfoSync();
  const { screenHeight, safeArea } = systemInfo;

  // 动态设置底部导航栏的位置
  this.setData({
    screenHeight: screenHeight,
    safeArea: safeArea
  });
},
  // 顶部搜索按钮事件
  onSearchTap() {
    my.showToast({
      type: 'none',
      content: '搜索功能未实现'
    });
  },

  // 顶部添加按钮事件
  onAddTap() {
    my.showToast({
      type: 'none',
      content: '添加功能未实现'
    });
  },

  // 各个模块的跳转事件
  onWarehouseTap() {
    my.navigateTo({
      url: '/pages/warehouse/warehouse'
    });
  },

  onInventoryTap() {
    my.navigateTo({
      url: '/pages/inventory/inventory'
    });
  },

  onDistinguishTap() {
    my.navigateTo({
      url: '/pages/distinguish/distinguish'
    });
  },

  onTaskCenterTap() {
    my.navigateTo({
      url: '/pages/taskCenter/taskCenter'
    });
  },

  // 底部导航栏点击事件
 onMessageTap() {
    my.switchTab({
      // url: '/pages/message/message'
    });
  },
  onWorkbenchTap() {
    // 当前页面，保持在工作台
  },

  onProfileTap() {
    my.navigateTo({
      url: '/pages/profile/profile'
    });
  }
});
