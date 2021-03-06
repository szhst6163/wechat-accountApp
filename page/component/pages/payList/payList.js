Component({
    properties: {
        data: {
            type: Array,
            value: []
        },
        selectedDate: {
            type: String,
            value: ""
        },
        total:{
            type: [String,Number],
            value: 0
        }
    },
    data: {
        isShow:true,
    },
    methods: {
        totalNum(){
            let total = 0;
            this.data.forEach(res=>{
                total += res.value;
            });
            this.setData({total});
            console.log(this.data)
        },
        bindDateChange(evt){
            this.triggerEvent("dateChange",evt.detail.value);
        },
        hideList: function (e) {
            this.setData({
                isShow:!e.currentTarget.dataset.isshow,
            });
            console.log(this.data)
        }
    }
})