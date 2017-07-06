var Page = {
	ItemId: null,
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.plusReady(function() {
			window.addEventListener('detailShow', function(event) {
				self.vue.couponData=event.detail.couponData
				console.log(self.vue.couponData)
				self.vue.logo = E.getStorage('logo')
				self.vue.couponInfo = JSON.parse(E.getStorage('couponInfo'));
				self.vue.showData = false;
			})
			var oldBack=mui.back;
			mui.back=function(){
				setTimeout(function(){
				 self.vue.showData = true;
				 self.vue.couponData={}
				 self.vue.logo=''
				 self.vue.couponInfo={}
				},250)
				oldBack()
			}
		});
	},
	vueObj: {
		el: '#vue',
		data: {
			couponData:{},
			showData: true,
			logo: '',
			couponInfo: {}
		},
		methods: {
			save:function(){
				var self=this;
				var params = E.systemParam('V5.mobile.coupon.info.add');
				params.couponData = JSON.stringify(this.couponData);
				E.showLoading()
				E.getData('couponInfoAdd', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					E.alert('新增成功',function(){
						E.hideWebview('createDiscount','auto',0)
						E.hideWebview('getStore','auto',0)
						mui.back()
					})
				})
			},
			goback: function() {
				mui.back()
			},
		}
	}

}
Page.init()