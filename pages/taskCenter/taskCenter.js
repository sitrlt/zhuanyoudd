Page({
  data: {
    activeTab: '未完成',
    tasks: [
      {
        taskId: '202412081048',
        taskType: '到货任务',
        taskTime: '2024-12-08 10:48',
        taskLocation: '杭州战勤保障处',
        taskStatus: '未完成'
      },
      {
        taskId: '202411141448',
        taskType: '审批任务',
        taskTime: '2024-11-14 14:48',
        taskLocation: '杭州西湖大队西湖站',
        taskStatus: '未完成'
      },
      {
        taskId: '202411141448',
        taskType: '验收任务',
        taskTime: '2024-11-14 14:48',
        taskLocation: '浙江省消防救援总队训练与战勤保障支队',
        taskStatus: '未完成'
      }
    ]
  },
  onLoad() {
    // 页面加载时调用，可在这里获取任务数据
  },
  // 显示任务详情并传递参数
  showTaskDetail(e) {
    const taskId = e.currentTarget.dataset.taskId; // 获取传递的 taskId
    my.navigateTo({
      url: `/pages/delayedTaskDetail/delayedTaskDetail?taskId=${taskId}`
    });
  },
  changeTab(e) {
    this.setData({
      activeTab: e.currentTarget.dataset.tab
    });
  }
});
