import formatDate from '../../../common/vlib/util/formatDate.js';

Component({
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    }, //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden
    modalMsg: {
      type: String,
      value: '',
    },
    formType: {
      type: String,
      value: ""
    },
    date: {
      type: String,
      value: formatDate(new Date(), "yyyy-MM-dd")
    },
    datatype: {
      type: String,
      value: ""
    }
  },
  data: {
    // 这里是一些组件内部数据
    input: "",
  },
  methods: {
    // 这里放置自定义方法
    setDatas() {
      return new Promise((r, d) => {
        let _self = this;
        let isAdd = this.data.datatype == "income" ? 1 : -1;
        let newData = {
          date: this.data.date,
          buyType: this.data.modalMsg,
          value: this.data.input * isAdd
        };
        if (this.data.formType == "money") {
          wx.getStorage({
            key: "payData",
            success: function (res) {
              res.data.push(newData);
              wx.setStorage({
                key: "payData",
                data: res.data,
              });
              r();
            },
            fail(res) {
              wx.setStorage({
                key: "payData",
                data: [newData]
              });
              r();
            }
          })
        }
      })
    },
    resetInput() {
      this.setData({
        input: ""
      });
    },
    formSubmit(e) {
      if (!this.data.date) {
        wx.showToast({
          title: '请选择日期再添加支出！'
        });
        return
      }
      if (!e.detail.value.input) return;
      this.setData({
        modalHidden: true,
        input: e.detail.value.input
      });
      this.setDatas()
        .then(res => {
          this.resetInput();
          this.triggerEvent("action");
        })

    },
    modal_click_Hidden: function () {
      this.setData({
        modalHidden: true,
        input: ""
      });
    },
  }
})  