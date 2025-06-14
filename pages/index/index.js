const app = getApp();
import dd from 'gdt-jsapi';

Page({
  data: {
    phone: '',
    password: '',
    userInfo: {}, // 用于存储用户信息
    authCode: '', // 用于存储授权码
    isLoading: false,
    token: null,
  },
  async onLoad() {

    dd.getAuthCode({
      corpId: ""
    }).then(res => {
      console.log(res);
      this.setData({
        authCode: res.code
      });
      this.getLogin();
    });

    // 立即显示加载遮罩
    this.setData({ isLoading: true });
    // 异步验证 token
    const hasValidToken = await this.checkToken();
    console.log(hasValidToken)
    if (hasValidToken === false) {
      setTimeout(() => {
        this.setData({ isLoading: false });
      }, 5000);
    }

  },

  checkToken() {
    return new Promise((resolve) => {
      // 检查全局数据中是否有 token
      if (!app.globalData.token) {
        resolve(false);
        return;
      }

    });
  },
  getCode() {
    dd.getAuthCode({
      corpId: ""
    }).then(res => {
      console.log(res)
      this.setData({
        authCode: res.code
      });

    }).catch(err => { })

  },

  // 处理手机号输入
  onPhoneInput(event) {
    this.setData({
      phone: event.detail.value
    });
  },

  // 处理密码输入
  onPasswordInput(event) {
    this.setData({
      password: event.detail.value
    });
  },

  getLogin() {
    this.getCode()
    const { phone, password, authCode } = this.data;
    const data = {
      phone: phone,
      passWord: password,
      code: authCode
    }
    console.log("当前data", data)
    my.request({
      url: '/activation', // 后端接口地址
      method: 'POST', // 请求方法
      data: {
        phone: phone,
        passWord: password,
        code: authCode
      },
      success: (response) => {

        if (response.data.code != 200) {
          console.error("错误：", response.data.msg)
        } else {
          this.getCode()
          console.log("登录成功：", response.data);
          this.setData({ token: token })
          const token = response.data.token; // 返回的数据中包含令牌
          app.globalData.token = token;
          // 使用令牌调用获取用户信息的接口
          if (token) {
            this.getUserInfo(token);
             my.redirectTo({
            url: '/pages/workbench/workbench'  // 跳转到工作台页面
          });
          }
         
        }

      },
      fail: (error) => {
        console.error("登录失败：", error);
        my.showToast({
          type: 'fail',
          content: '登录失败，请检查账号和密码',
          duration: 1000
        });
      }
    });
  },


  // 下一步按钮事件
  onLogin() {
    const { phone, password, authCode } = this.data;
    if (phone && password) {
      my.showToast({
        type: 'loading',
        content: '登录中...',
        duration: 1000
      });
      my.request({
        url: '/activation', // 后端接口地址
        method: 'POST', // 请求方法
        data: {
          phone: phone,
          passWord: password,
          code: authCode
        },
        success: (response) => {
          const msg = response.data.msg
          if (msg === "用户不存在") {
             console.log("用户不存在")
          } else if (msg === "密码错误") {
            my.showToast({
              type: 'fail',
              content: '密码输入错误',
              duration: 1000
            });
          }else {
            this.getCode()
            console.log("登录成功：", response.data);
            // 登录成功后保存令牌或会话ID
            this.setData({ token: token })
            const token = response.data.token; // 返回的数据中包含令牌
            app.globalData.token = token;
            console.log("当前token：",token)
            // 使用令牌调用获取用户信息的接口
            if (token) {
              this.getUserInfo(token);
              my.redirectTo({
              url: '/pages/workbench/workbench'  // 跳转到工作台页面
            });
            }
            
          }
        },
        fail: (error) => {
          console.error("登录失败：", error);
        }
      });
    } else {
      my.showToast({
        type: 'fail',
        content: '请输入完整信息',
        duration: 1000
      });
    }
  },

  // 获取用户信息
  getUserInfo(token) {
    my.request({
      url: '/system/user/profile', // 获取用户信息的接口地址
      method: 'GET', // 请求方法
      headers: {
        'Authorization': `Bearer ${token}` // 使用Bearer令牌进行认证
      },
      success: (response) => {
        const userInfo = response.data.data;
        // 获取 App 实例
        app.globalData.userInfo = userInfo;
        console.log("用户信息：", response.data.data);
        this.setData({
          userInfo: response.data
        });

      },
      fail: (error) => {
        console.error("获取用户信息失败：", error);
        my.showToast({
          type: 'fail',
          content: '获取用户信息失败',
          duration: 1000
        });
      }
    });
  },

  // 已有账号登录
  onDirectLogin() {
    my.navigateTo({
      url: '/pages/login/login'
    });
  }
});