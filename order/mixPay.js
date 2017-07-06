var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.init();
		mui.plusReady(function() {
			self.ws = plus.webview.currentWebview();
			self.vue.orderNumber = self.ws.orderNumber;
			self.vue.totalPrice = self.ws.totalPrice;
			self.vue.prePrice = self.ws.prePrice
			self.vue.loadData()
		})
		var old_back = mui.back;
		mui.back = function() {
			if (self.vue.prePrice > 0) {
				E.alert("支付中不能退出")
			} else {
				old_back()
			}

		}
		mui("#payList").on('tap', "button", function() {
			E.IsNum(this.parentNode.querySelector("input"));
			self.vue.pid = this.getAttribute("pid");
			self.vue.amount = this.parentNode.querySelector("input").value;
			if (!self.vue.amount || self.vue.amount == 0) {
				E.toast("请输入金额")
				return
			}
			if (parseFloat(self.vue.amount) > parseFloat(self.vue.waitPrice)) {
				E.toast("输入金额不能大于待付金额")
				return
			}
			self.vue.paySwitch()
		})
	},
	vueObj: {
		el: '#vue',
		data: {
			totalPrice: 0,
			orderNumber: "",
			prePrice: 0,
			showCardpay: false,
			amount: 0,
			pid: "",
			payments: [],
			password: "",
			memberCardNumber: ""
		},
		methods: {
			loadData: function() {
				var self = this;
				var params = E.systemParam("V5.mobile.paymentType.search");
				E.showLoading()
				E.getData('paymentTypeSearch', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					console.log(JSON.stringify(data))
					var payments = data.payments;
					for (var i = 0; i < payments.length; i++) {
						if (payments[i].paymentType != "6" && payments[i].paymentType != "13" && payments[i].paymentType != "14" && payments[i].paymentType != "15" && payments[i].paymentType != "16" && payments[i].paymentType != "17") {
							self.payments.push(payments[i]);
						}
					}
				}, "get")
			},
			paySwitch: function() {
				switch (this.pid) {
					case "6":
						this.barcodePay()
						break;
					case "15":
						this.barcodePay()
						break;
					case "16":
						this.cardShow()
						break;
					default:
						this.payMent()
						break;
				}
			},
			barcodePay: function() {
				E.openWindow("../barcode/payment.html", {
					orderNumber: this.orderNumber,
					pid: this.pid,
					amount: this.amount,
					type: "mix"
				})
			},
			closeMask: function() {
				this.showCardpay = false;
			},
			cardShow: function() {
				this.showCardpay = true;
				setTimeout(function() {
					E.showLayer(0)
				}, 0)
			},
			cardPay: function() {
				var self = this;
				if (!this.password || !this.memberCardNumber) {
					E.toast("信息不全");
					return
				}
				var params = E.systemParam("V5.mobile.order.mixture.pay");
				params = mui.extend(params, {
					orderNumber: this.orderNumber,
					memberCardNumber: this.memberCardNumber,
					password: this.password,
					authCode: "",
					amount: this.amount,
					paymentType: 16,
					type: "mixture"
				})
				this.showCardpay = false;
				E.showLoading()
				E.getData('orderMixturePay', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.completePay(self.amount)

				})
			},
			payMent: function() {
				var self = this;
				E.confirm("确认付款？", function() {
					var params = E.systemParam("V5.mobile.order.mixture.pay");
					params = mui.extend(params, {
						orderNumber: self.orderNumber,
						memberCardNumber: "",
						password: "",
						authCode: "",
						amount: self.amount,
						paymentType: self.pid,
						type: "mixture"
					})
					E.showLoading()
					E.getData('orderMixturePay', params, function(data) {
						E.closeLoading()
						if (!data.isSuccess) {
							E.alert(data.map.errorMsg)
							return
						}
						self.completePay(self.amount)
					})
				})
			},
			completePay: function(c) {
				var self = this;
				E.alert("支付成功", function() {
					mui("#payList button").each(function() {
						var pid = this.getAttribute("pid");
						if (pid == self.pid) {
							this.parentNode.querySelector("input").value = ""
							this.parentNode.querySelector(".payStatus").classList.add("success");
							this.parentNode.querySelector(".payStatus").innerHTML = "<span>已收</span>";
							this.classList.add("success")
							this.setAttribute("disabled", "disabled")
							this.parentNode.querySelector("input").setAttribute("disabled", "disabled")
						}
					})
					self.prePrice = (parseFloat(self.prePrice) + parseFloat(c)).toFixed(2);
					if (self.waitPrice == 0) {
						self.goOrderDetail()
					}
				});


			},
			goOrderDetail: function() {
				Page.ws.opener().evalJS("Page.vue.loadData('" + this.orderNumber + "')");
				plus.webview.close("mixPay.html", "pop-out");
			}
		},
		computed: {
			waitPrice: function() {
				return (parseFloat(this.totalPrice) - parseFloat(this.prePrice)).toFixed(2)
			}
		}
	}
}
Page.init()