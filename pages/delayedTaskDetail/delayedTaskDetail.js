Page({
  data: {
    approval: '', // 用于存储审批意见
    reason: '', // 用于存储驳回原因
    taskId: null // 存储传递的 taskId
  },

  // 查看文件
  viewFile() {
    // 在这里实现文件查看的逻辑，比如打开一个新的页面或链接
    my.showToast({ content: '查看文件功能未实现' });
  },

  onLoad(options) {
    // 获取传递的 taskId 参数
    this.setData({
      taskId: options.taskId || null
    });
    console.log("任务详情页面，任务单号:", this.data.taskId);

    // 可以在这里调用接口，获取任务详情信息
  },


  // 上传文件
  uploadFile() {
    // 实现文件上传逻辑，可以使用钉钉的文件上传接口
    my.chooseImage({
      count: 1,
      success: (res) => {
        my.showToast({ content: '文件上传成功' });
        // 可以在这里存储上传的文件信息
      },
      fail: (err) => {
        my.showToast({ content: '文件上传失败' });
      }
    });
  },

  // 处理审批意见的更改
  onApprovalChange(e) {
    this.setData({
      approval: e.detail.value
    });
  },

  // 处理驳回原因的输入
  onReasonInput(e) {
    this.setData({
      reason: e.detail.value
    });
  },

  // 提交审批
  submitApproval() {
    const { approval, reason } = this.data;
    
    if (approval === '') {
      my.showToast({ content: '请选择审批意见' });
      return;
    }
    
    if (approval === '驳回' && reason.trim() === '') {
      my.showToast({ content: '请输入驳回原因' });
      return;
    }

    // 在这里调用提交接口，将审批数据发送到后端
    my.showToast({ content: '提交成功' });
  }
});
