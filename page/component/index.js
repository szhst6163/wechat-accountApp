import formatDate from '../../page/common/vlib/util/formatDate.js'
import * as echarts from '../common/lib/ec-canvas/echarts';

const app = getApp();

function setOption(chart) {
    let option = {
        backgroundColor: "#fff",
        color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
        title: {
            show: true,
            text: `${new Date().getMonth() + 1}月`,
            top: "3%",
            left: "5%"
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            bottom: 10,
            data: ['总收入']
        },
        grid: {
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            x: 'center',
            type: 'value'
        },
        series: [{
            name: '总收入',
            type: 'line',
            smooth: true,
            data: [3, 3, 3]
        }
        ]
    };

    chart.setOption(option);
}

Page({
    data: {
        ec: {},
        ecComponent: null,
        is_modal_Msg: "",
        datatype: "",
        is_modal_Hidden: true,
        imgSrc:"resources/kind/menu-price.png",
        list: [
            {
                id: 'view',
                name: '记账',
                open: false,
                pages: ['吃饭', '衣服', '买球', '衣服', '买球', '衣服', '买球', '衣服', '买球']
            },
        ],
        defDate: formatDate(new Date(), "yyyy-MM-dd"),
        getDate: formatDate(new Date(), "yyyy-MM-dd"),
        payList: [],
        selectedDate: "",
        writeDate: formatDate(new Date(), "yyyy-MM-dd"),
    },
    onReady() {
        this.init();
        this.checkDate();
        this.getUserInfo();
    },
    onShow() {
        this.init();
        this.checkDate();
    },
    getUserInfo() {
        wx.getUserInfo({
            success:res=>{
                console.log(res)
            },
            fail:res=>{
                console.warn(res)
            }
        })
    },
    bindDateChange(evt) {
        this.setData({selectedDate: evt.detail.value})
    },
    init() {
        this.getStorage();
        this.initChart().then(this.initChartData);

    },
    checkDate() {
        if (new Date().getDate() == 1) {
            this.clearStorage();
        }
    },
    initChartData() {
        let data = {
            series: [{
                name: '支出',
                type: 'line',
                smooth: true,
                data: []
            }],
            xAxis: {
                data: []
            }
        };
        let total = 0;
        let dayIncomeHash = {};
        let arr = [];
        this.data.payList.forEach(res => {
            if (!dayIncomeHash[res.date]) {
                dayIncomeHash[res.date] = 0;
            }
            dayIncomeHash[res.date] += res.value * 1
        });
        for (let k in dayIncomeHash) {
            arr.push(k);
            // total+=dayIncomeHash[k];
            // data.series[0].data.push(total);
            // data.xAxis.data.push(k)
        }
        arr = arr.sort();
        arr.forEach(res => {
            total += dayIncomeHash[res];
            data.series[0].data.push(total);
        });
        data.xAxis.data = arr;
        this.setData({total:total});
        this.chart.setOption(data)
    },
    initChart() {
        return new Promise((r, d) => {
            this.ecComponent = this.selectComponent('#mychart-dom-line');
            this.ecComponent.init((canvas, width, height) => {
                // 获取组件的 canvas、width、height 后的回调函数
                // 在这里初始化图表
                const chart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                setOption(chart);

                // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
                this.chart = chart;
                r();
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                return chart;
            });
        })
    },
    getStorage() {
        return new Promise((r, d) => {
            let _self = this;
            wx.getStorage({
                key: 'payData',
                success: function (res) {
                    _self.setData({
                        payList: res.data
                    });
                    r();
                },
                fail(res) {
                    wx.showToast({
                        title: '请开始你的表演！',
                    });
                    _self.setData({
                        payList: []
                    });
                    r();
                }
            })
        })

    },
    clearStorage(e) {
        let title = e ? "清除成功" : `你好${new Date().getMonth() + 1}月`;
        let _self = this;
        wx.removeStorage({
            key: "payData",
            complete() {
                wx.showToast({
                    title: title
                });
                _self.init();
            }
        });
    },
    dateChange(evt) {
        this.setData({writeDate: evt.detail})
    },
    clearDate() {
        this.setData({selectedDate: ""})
    },
    modalShow(evt) {
        this.setData({
            is_modal_Msg: evt.currentTarget.dataset.name,
            datatype: evt.currentTarget.dataset.datatype,
            is_modal_Hidden: false,
        })
    },
    kindToggle: function (e) {
        var id = e.currentTarget.id, list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list
        });
    }
})

