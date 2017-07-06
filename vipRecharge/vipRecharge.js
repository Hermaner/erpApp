var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.init();
		mui.plusReady(function() {
			mui("#payPopover").on('tap', "li", function() {
				var that = this;
				E.IsNumer(self.vue.amount, function() {
					self.vue.paymentType = that.getAttribute("sid");
					self.vue.produceOrder()
					mui('#payPopover').popover('hide');
				});

			})
		})
	},
	vueObj: {
		el: '#vue',
		data: {
			searchtext: "",
			items: null,
			amount: "",
			integral: "",
			orderNumber: "",
			paymentType: "",
			type: ""
		},
		methods: {
			searchItem: function() {
				if (!this.searchtext) {
					E.toast("请输入手机号码")
					return
				}
				var telReg = !!(this.searchtext).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if (telReg == false) {
					E.toast("请输入正确的手机号")
					this.searchtext = ""
					return
				}
				var self = this;
				var params = E.systemParam('V5.mobile.channelMember.get');
				params.mobilePhone = this.searchtext;
				E.showLoading()
				E.getData('channelMemberGet', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if (!data.isSuccess) {
						self.items=null
						E.alert(data.map.errorMsg)
						return
					}
					self.items = data.channelMember;
					self.items.mobilePhone = self.searchtext
				}, "get")
			},
			producePoint: function() {
				if (!this.integral) {
					E.toast("请输入充值积分")
					return
				}
				if (!this.items) {
					E.toast("请先输入手机查询")
					return
				}
				var self = this;
				E.IsNumer(this.amount, function() {
					var params = E.systemParam('V5.mobile.channel.point.add');
					params = mui.extend(params, {
						memberNo: self.items.memberNo,
						point: parseInt(self.integral)
					})
					E.showLoading()
					E.getData('channelMemberPointAdd', params, function(data) {
						console.log(JSON.stringify(data))
						E.closeLoading()
						if (!data.isSuccess) {
							E.alert(data.map.errorMsg)
							return
						}
						self.completePay("保存成功");
					}, "get")
				});
			},
			produceOrder: function() {
				if (!this.amount) {
					E.toast("请输入充值金额")
					return
				}
				if (!this.items) {
					E.toast("请先输入手机查询")
					return
				}
				var self = this;
				var params = E.systemParam('V5.mobile.channel.pay.add');
				params = mui.extend(params, {
					memberNo: this.items.memberNo,
					amount: this.amount
				})
				E.showLoading()
				E.getData('channelMemberPayAdd', params, function(data) {
					console.log(JSON.stringify(data))
					if (!data.isSuccess) {
						E.closeLoading()
						E.alert(data.map.errorMsg)
						return
					}
					self.orderNumber = data.channelMemberPay.number;
					self.paySwitch()
				}, "get")
			},
			paySwitch: function() {
				switch (this.paymentType) {
					case "6":
						this.barcodePay()
						break;
					case "15":
						this.barcodePay()
						break;
					default:
						this.payMent()
						break;
				}
			},
			barcodePay: function() {
				E.openWindow("../barcode/payment.html", {
					orderNumber: this.orderNumber,
					pid: this.paymentType,
					type: "card"
				})
			},
			payMent: function() {
				var self = this
				var params = E.systemParam("V5.mobile.erp.pay");
				params = mui.extend(params, {
					number: this.orderNumber,
					authCode: '',
					memberCardNumber: "",
					password: "",
					paymentType: parseInt(this.paymentType),
					type: "card"
				})
				E.showLoading()
				E.getData('erpPay', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
			},
			completePay: function(c) {
				E.alert(c, function() {
					mui.back()
				})
			},
		}
	}
}
Page.init()