//index.js
const app = getApp();
import data from './data';
let raw = data;
let recommendCity = {};
let selectCity = {};

Page({
  data: {
    raw: '',
    selectIndex: 0,
    selectItem: {},
    btnDisable: true,
  },

  onLoad: function () {
    recommendCity = {};
    selectCity = {};
    raw[0].selected = true;
    this.setData({
      raw: raw,
    });
  },

  //省市选择
  selectProvince: function (e) {
    let index = e.currentTarget.dataset.index;
    let selectIndex = this.data.selectIndex;
    let raw = this.data.raw;
    if (index != selectIndex) {
      raw[index].selected = !raw[index].selected;
      raw[selectIndex].selected = !raw[selectIndex].selected;
      this.setData({
        raw: raw,
        selectIndex: index
      });
    }
  },

  selectCity: function (e) {
    let index = e.currentTarget.dataset.index;
    let raw = this.data.raw;
    let selectIndex = this.data.selectIndex;
    let province = raw[selectIndex];
    let cities = province.sub;
    cities[index].selected = !cities[index].selected;
    //update select array
    let selectItem = this.data.selectItem;
    if (selectItem[selectIndex]) {
      let num = selectItem[selectIndex];
      if (cities[index].selected) {
        num = num + 1;
      }
      else
        num = num - 1;
      selectItem[selectIndex] = num;
      if (num == 0) {
        selectItem[selectIndex] = null;
      }
    }
    else {
      let num = 0;
      if (cities[index].selected) {
        num = 1;
        selectItem[selectIndex] = num;
      }
    }
    if (selectIndex == 0) {
      //recommend city
      let cityName = cities[index].name;
      if (cities[index].selected) {
        recommendCity[cityName] = 1;
      }
      else {
        recommendCity[cityName] = null;
      }
    }
    else {
      //save other city
      let cityName = cities[index].name;
      if (cities[index].selected) {
        selectCity[cityName] = 1;
      }
      else {
        selectCity[cityName] = null;
      }
    }
    let btnDisable = true;
    if (cities[index].selected) {
      btnDisable = false;
    }
    else{
      for (var key in selectItem) {
        if (selectItem[key] != null) {
          btnDisable = false;
          break;
        }
      }
    }
    this.setData({
      raw: raw,
      selectItem: selectItem,
      btnDisable: btnDisable
    });
  },

  /**
    * 提交
    */
  submitCity: function () {
    let selectItem = this.data.selectItem;
    let selectProvince = [];
    let cities = [];
    //处理数据
    for (var key in selectItem) {
      if (selectItem[key] != null) {
        if (key == 0) {
          continue;
        }
        let province = raw[key].name;
        selectProvince = selectProvince.concat(province);
      }
    }
    for (var key in recommendCity) {
      let item = recommendCity[key];
      if (item != null) {
        selectProvince = selectProvince.concat(key);
        cities = cities.concat(key);
      }
    }
    for (var key in selectCity) {
      let item = selectCity[key];
      if (item != null) {
        cities = cities.concat(key);
      }
    }
    if(selectProvince.length == 0 || cities.length == 0){
      return;
    }
    var data = JSON.stringify(selectProvince);
    cities = JSON.stringify(cities);
    wx.navigateTo({
      url: '../map/index?data=' + data + '&cities=' + cities,
    })
  },

})
