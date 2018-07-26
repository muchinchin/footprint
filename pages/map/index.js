import * as echarts from '../../ec-canvas/echarts';
import geoJson from './mapData.js';
const app = getApp();

function setOption(chart, data) {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: 0,
      max: 100,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true,
      show: false
    },
    // toolbox: {
    //   show: true,
    //   orient: 'vertical',
    //   left: 'right',
    //   top: 'center',
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    series: [{
      type: 'map',
      mapType: 'china',
      zoom: 1.2,
      silent: true,
      label: {
        normal: {
          show: false
        },
        emphasis: {
          textStyle: {
            color: '#fff'
          }
        }
      },
      itemStyle: {
        normal: {
          borderColor: '#fff',
          areaColor: '#979797',
        },
        // emphasis: {
        //   areaColor: '#979797',
        //   borderWidth: 0
        // }
      },
      animation: false,
      data: data
    }],

  };
  chart.setOption(option);
}

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    provinces: [],
    cities: [],
    percentage: '',
    isHidden:false
  },

  onLoad: function (option) {
    let data = JSON.parse(option.data);
    let cities = JSON.parse(option.cities);

    //0—5, 40%
    //5-10, 30%
    //10-20, 15%
    //20-30, 10%
    let calcspeed = data.length * 300;
    var networkBidthWidth = 0;
    if (calcspeed > 0 && calcspeed < 600) {
      networkBidthWidth = Math.round(calcspeed / 20);
    } else if (calcspeed >= 600 && calcspeed < 1024) {
      networkBidthWidth = Math.round((calcspeed - 600) / 21.5) + 30;
    } else if (calcspeed >= 1024 && calcspeed < 5120) {
      networkBidthWidth = Math.round((calcspeed - 1024) / 205) + 50;
    } else if (calcspeed >= 5120 && calcspeed < 10240) {
      networkBidthWidth = Math.round((calcspeed - 5120) / 256) + 70;
    } else if (calcspeed >= 10240) {
      networkBidthWidth = 99;
    }
    
    this.init(data);
    this.setData({
      provinces: data,
      cities: cities,
      percentage: networkBidthWidth
    });
  },

  // 点击按钮后初始化图表
  init: function (e) {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-area');
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      echarts.registerMap('china', geoJson);
      //处理传过来的data
      let data = [];
      for (var i = 0; i < e.length; i++) {
        let item = {};
        item.value = 10;
        item.name = e[i];
        data = data.concat(item);
      }
      setOption(chart, data);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  /**
  * 分享
  */
  onShareAppMessage: function () {
    return {
      title: '你都去过哪些城市？',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

});
