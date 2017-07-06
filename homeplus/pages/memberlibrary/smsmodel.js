var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.plusReady(function() {
			window.addEventListener('detailShow', function(event) {
				self.vue.couponId = event.detail.couponId;
				self.vue.mobilePhones = event.detail.mobilePhones;
				self.vue.loadData()
			})
		});
	},
	vueObj: {
		el: '#vue',
		data: {
			showData:true,
			couponId: '',
			mobilePhones: '',
			templateContent: '',
			couponName: '',
		},
		methods: {
			loadData: function() {
				var self = this;
				var params = E.systemParam('V5.mobile.coupon.sms.read');
				params = mui.extend(params, {
					couponId: this.couponId
				})
				E.getData('couponSMSRead', params, function(data) {
					self.showData=false
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.templateContent = data.smsTemplate.templateContent
					self.couponSMSID=data.smsTemplate.smsId
				}, "get")
			},
			goback: function() {
				mui.back()
			},
			sendsms: function() {
				var self = this;
				var params = E.systemParam('V5.mobile.counpon.sms.send');
				params = mui.extend(params, {
					couponId: this.couponId,
					mobilePhones: this.mobilePhones,
					couponSMSID:this.couponSMSID
				})
				E.showLoading()
				E.getData('couponSMSSend', params, function(data) {
					E.closeLoading()
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					E.alert('发送成功',function(){
						mui.back()
					})

				}, "get")
			}

		}
	}

}
Page.init()