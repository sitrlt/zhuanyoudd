const app = getApp()
Page({
  data: {
    deptId: null,
    searchText: '',
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
    totalCount: 0,
    inventory: [],
    units: [],
    showUnitSelectionModal: false,
    showDetailsModal: false,
    selectedItem: {},
    view: 'level1',
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    selectedLevel1: {},
    selectedLevel2: {},
    selectedLevel3: {},
    selectedLevel4: {},
    selectedUnits: [],
    selectedUnitsByLevel: {
      level1: [],
      level2: [],
      level3: [],
      level4: []
    },
    multiSelectMode: true, // 恢复多选模式
    cascadeSelection: true, // 级联选择模式
    maxSelectCount: 10, // 最大选择数量
  },

  onLoad() {
    this.setData({deptId:app.globalData.userInfo.deptId})
    this.getDeptTree();
  },

  // 获取部门树
  getDeptTree() {
    my.request({
      url: '/system/dept/queryAuthDeptTreeList',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      success: (response) => {
        if (response.data.code === 200) {
          console.log("当前部门数据：", response.data.data.list);
          const level1 = response.data.data.list.map(item => ({
            ...item,
            selected: this.isUnitSelected('level1', item.value)
          }));
          this.setData({ level1 });
        } else {
          console.error("获取信息失败：", response.data.msg);
          my.showToast({
            type: 'fail',
            content: response.data.msg || '获取信息失败',
            duration: 1000
          });
        }
      },
      fail: (error) => {
        console.error("请求失败：", error);
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 1000
        });
      }
    });
  },

  // 获取商品库存
  getCommodity() {
    const { currentPage, pageSize, deptId } = this.data;
    const data = {
      deptId: deptId,
      pageNum: currentPage,
      pageSize: pageSize,
      typeName: this.data.searchText
    }
    console.log("当前用户id：", deptId)
    my.request({
      url: '/wms/commodity/queryWmsListPage',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      data: JSON.stringify(data),
      success: (response) => {
        console.log("当前信息：", response.data);
        const data = response.data.rows;
        const totalCount = response.data.total;
        this.setData({
          inventory: data,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        });
      },
      fail: (error) => {
        console.error("获取数据失败：", error);
      }
    });
  },

  // 分页相关方法
  prevPage() {
    const { currentPage } = this.data;
    if (currentPage > 1) {
      this.setData({
        currentPage: currentPage - 1
      });
      this.getCommodity();
    }
  },

  nextPage() {
    const { currentPage, totalPages } = this.data;
    if (currentPage < totalPages) {
      this.setData({
        currentPage: currentPage + 1
      });
      this.getCommodity();
    }
  },

  // 打开单位选择弹窗
  openUnitSelection() {
    this.setData({ showUnitSelectionModal: true, view: 'level1' });
  },

  // 关闭单位选择弹窗
  closeUnitSelection() {
    // 合并所有层级的已选单位
    const allSelectedUnits = [
      ...this.data.selectedUnitsByLevel.level1,
      ...this.data.selectedUnitsByLevel.level2,
      ...this.data.selectedUnitsByLevel.level3,
      ...this.data.selectedUnitsByLevel.level4
    ];

    this.setData({
      showUnitSelectionModal: false,
      selectedUnits: allSelectedUnits
    });

    // 显示已选单位
    const selectedUnitNames = allSelectedUnits.map(unit => unit.label).join('、');
    my.alert({
      title: '选择的单位',
      content: `您选择了：${selectedUnitNames || '未选择任何单位'}`
    });

    // 根据选择的单位过滤库存数据
    this.filterInventoryByUnits(allSelectedUnits);
  },

  // 根据选择的单位过滤库存数据
  filterInventoryByUnits(units) {
    if (!units || units.length === 0) {
      // 如果没有选择任何单位，直接返回所有库存数据
      this.getCommodity();
      return;
    }

    // 获取所有选中单位的ID
    const unitIds = units.map(unit => unit.value);
    app.globalData.deptIds = unitIds;

    // 调用接口获取过滤后的库存数据
    const { currentPage, pageSize } = this.data;
    const data = {
      deptIds: unitIds,
      pageNum: currentPage,
      pageSize: pageSize
    };
    console.log("当前data:", data);
   
    my.request({
      url: '/wms/commodity/queryWmsListPage',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app.globalData.token}`,
      },
      data: JSON.stringify(data),
      success: (response) => {
        console.log("过滤后的库存数据：", response.data);
        const data = response.data.rows || [];
        const totalCount = response.data.total || 0;
        this.setData({
          inventory: data,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        });
      },
      fail: (error) => {
        console.error("获取过滤数据失败：", error);
        my.showToast({
          type: 'fail',
          content: '获取过滤数据失败',
          duration: 1000
        });
      }
    });
  },

  // 统一处理单位点击事件
  handleUnitTap(e) {
    const level = e.currentTarget.dataset.level;
    const selectedItem = {
      value: e.currentTarget.dataset.id,
      label: e.currentTarget.dataset.label,
      children: e.currentTarget.dataset.children
    };

    // 检查是否达到最大选择数量
    const currentSelectedCount = this.getSelectedCount();
    if (this.data.multiSelectMode && 
        !this.isUnitSelected(level, selectedItem.value) && 
        currentSelectedCount >= this.data.maxSelectCount) {
      my.showToast({
        type: 'none',
        content: `最多只能选择${this.data.maxSelectCount}个单位`,
        duration: 2000
      });
      return;
    }

    // 检查是否有子级，决定是进入下一级还是切换选择状态
    if (selectedItem.children && selectedItem.children.length > 0) {
      // 有子级，进入下一级
      this.goToNextLevel(level, selectedItem);
    } else {
      // 没有子级，切换选择状态
      this.toggleUnitSelection(level, selectedItem);
    }
  },

  // 计算当前已选单位数量
  getSelectedCount() {
    return Object.values(this.data.selectedUnitsByLevel)
      .reduce((total, units) => total + units.length, 0);
  },

  // 检查单位是否已选
  isUnitSelected(level, unitId) {
    return this.data.selectedUnitsByLevel[level].some(unit => unit.value === unitId);
  },

  // 切换单位选择状态
  toggleUnitSelection(level, selectedItem) {
    const selectedUnitsByLevel = this.data.selectedUnitsByLevel;
    const isSelected = this.isUnitSelected(level, selectedItem.value);

    if (isSelected) {
      // 取消选择
      selectedUnitsByLevel[level] = selectedUnitsByLevel[level].filter(
        unit => unit.value !== selectedItem.value
      );
    } else {
      // 添加选择
      if (this.data.multiSelectMode) {
        // 多选模式
        selectedUnitsByLevel[level].push(selectedItem);
      } else {
        // 单选模式
        selectedUnitsByLevel[level] = [selectedItem];
      }
    }

    // 更新数据绑定
    this.setData({ selectedUnitsByLevel });

    // 更新当前层级的选中状态
    this.updateLevelSelectionStatus(level);
  },

  // 更新层级的选中状态
  updateLevelSelectionStatus(level) {
    const currentLevelData = this.data[level];
    const selectedUnits = this.data.selectedUnitsByLevel[level];

    const updatedLevelData = currentLevelData.map(item => ({
      ...item,
      selected: selectedUnits.some(unit => unit.value === item.value)
    }));

    this.setData({ [level]: updatedLevelData });
  },

  // 进入下一级
  goToNextLevel(currentLevel, selectedItem) {
    const currentLevelNum = parseInt(currentLevel.slice(-1));
    const nextLevel = `level${currentLevelNum + 1}`;

    // 更新已选单位状态
    const selectedUnitsByLevel = this.data.selectedUnitsByLevel;

    // 如果是级联选择模式，清除下级选择
    if (this.data.cascadeSelection) {
      // 清除当前级别以下的已选单位
      for (let i = currentLevelNum + 1; i <= 4; i++) {
        selectedUnitsByLevel[`level${i}`] = [];
        this.setData({
          [`selectedLevel${i}`]: {}
        });
      }
    }

    // 更新当前层级的选择状态
    if (this.data.multiSelectMode) {
      // 多选模式：切换选择状态
      const isSelected = this.isUnitSelected(currentLevel, selectedItem.value);
      if (isSelected) {
        selectedUnitsByLevel[currentLevel] = selectedUnitsByLevel[currentLevel].filter(
          unit => unit.value !== selectedItem.value
        );
      } else {
        selectedUnitsByLevel[currentLevel].push(selectedItem);
      }
    } else {
      // 单选模式：直接选中
      selectedUnitsByLevel[currentLevel] = [selectedItem];
    }

    // 更新视图
    this.setData({
      view: nextLevel,
      [`selectedLevel${currentLevelNum}`]: selectedItem,
      [nextLevel]: selectedItem.children || [],
      selectedUnitsByLevel
    });

    // 更新下一级的选中状态
    this.updateLevelSelectionStatus(nextLevel);
  },

  // 返回上一级
  goBack() {
    const currentLevel = parseInt(this.data.view.slice(-1));
    if (currentLevel > 1) {
      const prevLevel = `level${currentLevel - 1}`;
      this.setData({ view: prevLevel });
    }
  },

  // 移除已选单位
  removeSelectedUnit(e) {
    const level = e.currentTarget.dataset.level;
    const unitId = e.currentTarget.dataset.id;

    const selectedUnitsByLevel = this.data.selectedUnitsByLevel;
    selectedUnitsByLevel[level] = selectedUnitsByLevel[level].filter(unit => unit.value !== unitId);

    this.setData({ selectedUnitsByLevel });

    // 更新当前层级的选中状态
    this.updateLevelSelectionStatus(level);
  },

  // 处理搜索输入
  onSearchInput(searchText) {
    console.log("搜索内容：", searchText);
    this.setData({ searchText });
    // 根据搜索条件过滤库存数据
    this.getCommodity();
  },

  handleCancel() {
    this.setData({
      searchText: '',
      inventory: ''
    });
  },

  handleClear() {
    this.setData({
      searchText: '',
      inventory: ''
    });
  },

  // 查看详情
  showDetails(event) {
    const id = event.currentTarget.dataset.id;
    console.log("当前点击事件：", event);
    const selectedItem = this.data.inventory.find(item => item.id === id);
    app.globalData.item = selectedItem;
    console.log("当前inventory信息：", selectedItem);
    my.navigateTo({
      url: `/pages/inventory1/inventory1?id=${id}`
    });
  },

  // 关闭库存详情弹窗
  closeDetails() {
    this.setData({ showDetailsModal: false });
  }
});  