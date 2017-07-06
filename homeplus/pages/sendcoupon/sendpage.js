var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.plusReady(function() {
			window.addEventListener('detailShow', function(event) {
				self.vue.couponId = event.detail.coupon;
			})
		});
	},
	vueObj: {
		el: '#vue',
		data: {
			mobilePhone: '',
			memberName: '',
			couponId: '',
			Birthday: '',
			Sex: ''
		},
		methods: {
			saveData: function() {
				if(!this.mobilePhone) {
					E.toast('请输入手机号')
					return
				}
				var telReg = (this.mobilePhone).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				console.log(telReg)
				if(!telReg) {
					E.toast("请输入正确的手机号")
					return
				}
				var self = this;
				var params = E.systemParam('V5.mobile.coupon.info.send');
				params=mui.extend(params,{
					couponId:this.couponId,
					mobilePhone:this.mobilePhone,
					memberName:this.memberName,
					Sex:this.Sex,
					Birthday:this.Birthday
				})
				E.showLoading()
				E.getData('couponInfoSend', params, function(data) {
					E.closeLoading();
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					E.alert('发送成功',function(){
						mui.back()
					})
				})
			},
			goback: function() {
				mui.back()
			},
			optionTime: function(options) {
				var self = this
				var picker = new mui.DtPicker(options);
				picker.show(function(rs) {
					var rsTime = new Date(rs.text.replace(/-/g, "/")).getTime();
					var now = (new Date()).getTime()
					if(rsTime >= now) {
						alert('出生日期选择错误')
						return
					}
					self.birthday = rs.text
					picker.dispose();
				});
			},
			switchSex: function() {
				if(mui('.mui-switch')[0].classList.contains('mui-active')) {
					this.Sex = 1
				} else {
					this.Sex = 2
				}
			}
		}
	}

}
Page.init()