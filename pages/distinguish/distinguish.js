Page({
  data: {
    inputValue: '', // 输入框内容
  },

  // 处理输入框的内容变化
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  onAsset() {
    my.navigateTo({
      url: '/pages/asset/asset'
    });
  },

  // 点击搜索按钮
  onSearch() {
    if (!this.data.inputValue) {
      my.showToast({
        content: '请输入物资编码或EPC码',
      });
      return;
    }

    my.showToast({
      content: `搜索物资: ${this.data.inputValue}`,
    });

    // 可以在此调用接口执行搜索逻辑
  },

  // 点击扫描按钮
  onScan() {
    my.scan({
      type: 'qr',
      success: (res) => {
        my.showToast({
          content: `扫描成功: ${res.code}`,
        });

        // 可以在此处理扫码结果
      },
      fail: () => {
        my.showToast({
          content: '扫描失败，请重试',
        });
      },
    });
  },
});
