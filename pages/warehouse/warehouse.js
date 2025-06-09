const app = getApp();
Page({
  data: {
    view: 'warehouseList',  // 当前视图：'warehouseList'（仓库列表）、'categoryList'（分类列表）、'itemList'（物资列表）
    warehouses: [],
    categories: [],
    items: [],
    searchText: '',
    selectedWarehouse: {},
    selectedCategory: {}
  },

  onLoad() {
    const deptId = app.globalData.userInfo.deptId;
    console.log("当前用户id：", deptId);
    this.fetchData('warehouse', { deptId: deptId });
  },

  onSearchInput(searchText) {
    console.log("输入数据：", searchText);
    this.setData({ searchText: searchText });
    this.onSearch()
  },
  handleCancel() {
    this.setData({
      searchText: ''
    });
    this.onSearch()
  },
  handleClear(searchText) {
    this.setData({
      searchText: '',
    });
    this.onSearch()
  },
  onSearch() {
    if (this.data.view === 'itemList') {
      this.searchItems();
    } else if (this.data.view === 'categoryList') {
      this.searchCategories();
    } else if (this.data.view === 'warehouseList') {
      this.fetchData('warehouse', { deptId: app.globalData.userInfo.deptId, warehouseName: this.data.searchText });
    }
  },

  selectWarehouse(e) {
    const warehouseId = e.currentTarget.dataset.id;
    const selectedWarehouse = this.data.warehouses.find(w => w.warehouseId === warehouseId);

    const params = {
      warehouseId: warehouseId,
      reservoirAreaName: '' // 清空搜索参数
    };

    this.fetchData('reservoirArea', params, selectedWarehouse);
    this.setData({
      view: 'categoryList',
      selectedWarehouse,
      searchText: '' // 清空搜索框
    });
  },

  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    const selectedCategory = this.data.categories.find(c => c.reservoirAreaid === categoryId);
    app.globalData.reservoirAreaname = selectedCategory.reservoirAreaname;

    const params = {
      reservoirAreaId: categoryId,
      storagerackName: '' // 清空搜索参数
    };

    this.fetchData('storageRack', params, selectedCategory);
    this.setData({
      view: 'itemList',
      selectedCategory,
      searchText: '' // 清空搜索框
    });
  },

  searchCategories() {
    if (!this.data.selectedWarehouse.warehouseId) return;

    const params = {
      warehouseId: this.data.selectedWarehouse.warehouseId,
      reservoirAreaName: this.data.searchText
    };

    this.fetchData('reservoirArea', params, this.data.selectedWarehouse);
  },

  searchItems(w) {
    if (!this.data.selectedCategory.reservoirAreaid) return;

    const params = {
      reservoirAreaId: this.data.selectedCategory.reservoirAreaid,
      storagerackName: this.data.searchText
    };

    this.fetchData('storageRack', params, this.data.selectedCategory);

  },

  //下一页库室查询
  selectMateria(e) {
  const id = e.currentTarget.dataset.id;
  const selectedStoragerack = this.data.items.find(c => c.storagerackId === id);
  console.log("当前item：", selectedStoragerack);
  app.globalData.storagerackName = selectedStoragerack.storagerackName;
 
   const params = {
      reservoirAreaId: this.data.selectedCategory.reservoirAreaid,
      storagerackName: ''
    };

    this.fetchData('storageRack', params, this.data.selectedCategory);
 
  my.navigateTo({
    url: `/pages/warehouse1/warehouse1?id=${id}`
  });
  

},

  navigateBack() {
    if (this.data.view === 'categoryList') {
      this.setData({ view: 'warehouseList' });
    } else if (this.data.view === 'itemList') {
      this.setData({ view: 'categoryList' });
    }
  },

  fetchData(type, params, selectedData) {
    let url = '';
    let method = 'GET';
    let headers = {
      'Authorization': `Bearer ${app.globalData.token}`
    };
    let data = params;

    if (type === 'warehouse') {
      url = '/wms/warehouse/listAll';
    } else if (type === 'reservoirArea') {
      url = '/wms/reservoirarea/choiceList';
      method = 'POST';
      headers['Content-Type'] = 'application/json';
    } else if (type === 'storageRack') {
      url = '/wms/storagerack/choiceList';
      method = 'POST';
      headers['Content-Type'] = 'application/json';
    }

    my.request({
      url: url,
      method: method,
      headers: headers,
      data: data,
      success: (response) => {
        console.log("当前数据：", response.data);
        const result = response.data;
        if (type === 'warehouse') {
          this.setData({ warehouses: result.rows });
        } else if (type === 'reservoirArea') {
          const categories = result.data;
          this.setData({
            view: 'categoryList',
            selectedWarehouse: selectedData,
            categories
          });
        } else if (type === 'storageRack') {
          const items = result.data;
          this.setData({
            view: 'itemList',
            selectedCategory: selectedData,
            items
          });
        }
      },
      fail: (error) => {
        console.error("获取信息失败：", error);
        my.showToast({
          type: 'fail',
          content: '获取信息失败',
          duration: 1000
        });
      }
    });
  }
});