App({
  globalData: {
        userInfo: null,
        token:null,
        reservoirAreaname:null,
        storagerackName:null,
        storagelocationName:null,
        wmsNum:null,  
        storagelocationId:null,
        item:null,
        deptIds:null,
        foamGunsItem:null
  },
  
  onLaunch(options) {
    const basePath = 'http://axs.natapp1.cc';//http://axs.natapp1.cc,http://zjxfzb.com:9000
    
    // 拦截my.request
    const originalRequest = my.request;
    my.request = function(config) {
      if (!config.url.startsWith('http')) {
        config.url = basePath + (config.url.startsWith('/') ? config.url : '/' + config.url);
      }
      return originalRequest(config);
    };
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  
});
