Page({
  data: {
    showImageModal: false,  // 控制图片放大的弹窗显示与否
    modalImage: '',         // 用于放大的图片路径
    afterSaleScore: 0,
    equipmentScore: 0,
    comment: '',
    uploadedImages: [],  // 存储已选择的图片
    uploadedVideo: '',  // 存储已选择的视频
    comments: [
      {
        nickname: '李队长',
        comment: '不错非常好',
        images: ['/pages/a/comment1.png', '/pages/a/comment2.png'],
        video: '/pages/a/comment-video2.mp4',
        afterSaleScore: '★★★★☆',
        equipmentScore: '★★★☆☆',
        date: '2024-09-27 14:06:01',
      },
      {
        nickname: '刘士官',
        comment: '非常棒',
        images: ['/pages/a/comment3.png', '/pages/a/comment4.png'],
        afterSaleScore: '★★★★★',
        equipmentScore: '★★★★☆',
        date: '2024-09-27 14:06:01',
      }
    ],
  },

  // 评分功能
  rateAfterSale(e) {
    this.setData({ afterSaleScore: e.currentTarget.dataset.index + 1 });
  },

  rateEquipment(e) {
    this.setData({ equipmentScore: e.currentTarget.dataset.index + 1 });
  },

  // 监听输入框变化
  onCommentInput(e) {
    this.setData({ comment: e.detail.value });
  },

  // 选择图片
  chooseImage() {
    my.chooseImage({
      count: 3,  // 最多选择3张图片
      success: (res) => {
        this.setData({
          uploadedImages: res.apFilePaths,
        });
      },
    });
  },

  // 选择视频
  chooseVideo() {
    my.chooseVideo({
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          uploadedVideo: res.tempFilePath,
        });
      },
    });
  },

  // 提交评论
  submitComment() {
    if (!this.data.comment) {
      my.showToast({ content: '评论内容不能为空！' });
      return;
    }

    const newComment = {
      nickname: '用户',
      comment: this.data.comment,
      images: this.data.uploadedImages,  // 上传的图片
      video: this.data.uploadedVideo,    // 上传的视频
      afterSaleScore: this.data.afterSaleScore,
      equipmentScore: this.data.equipmentScore,
      date: new Date().toISOString(),
    };

    this.setData({
      comments: [newComment, ...this.data.comments],
      comment: '',
      uploadedImages: [],
      uploadedVideo: '',
      afterSaleScore: 0,
      equipmentScore: 0,
    });

    my.showToast({ content: '评论提交成功！' });
  },
  // 点击图片时，打开放大的图片
  openImage(e) {
    const imageSrc = e.currentTarget.dataset.src;  // 获取点击图片的src路径
    this.setData({
      showImageModal: true,
      modalImage: imageSrc,
    });
  },
  // 点击关闭放大图片
  closeImage() {
    this.setData({
      showImageModal: false,
      modalImage: '',  // 关闭时清空图片
    });
  },
});
