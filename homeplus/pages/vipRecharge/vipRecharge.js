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
			E.getStorage("vendor") == 0 && (self.vue.registerCashierReceiver())
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
				if(!this.searchtext) {
					E.toast("请输入手机号码")
					return
				}
				var telReg = !!(this.searchtext).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if(telReg == false) {
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
					if(!data.isSuccess) {
						self.items = null
						E.alert(data.map.errorMsg)
						return
					}
					self.items = data.channelMember;
					self.items.mobilePhone = self.searchtext
				}, "get")
			},
			producePoint: function() {
				if(!this.integral) {
					E.toast("请输入充值积分")
					return
				}
				if(!this.items) {
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
						if(!data.isSuccess) {
							E.alert(data.map.errorMsg)
							return
						}
						self.completePay("保存成功");
					}, "get")
				});
			},
			produceOrder: function() {
				if(!this.amount) {
					E.toast("请输入充值金额")
					return
				}
				if(!this.items) {
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
					if(!data.isSuccess) {
						E.closeLoading()
						E.alert(data.map.errorMsg)
						return
					}
					self.orderNumber = data.channelMemberPay.number;
					self.paySwitch()
				}, "get")
			},
			paySwitch: function() {
				switch(this.paymentType) {
					case "6":
						this.barcodePay()
						break;
					case "14":
						if(E.getStorage("vendor") == 0) {
							this.doPosCashier();
						} else {
							this.payMent()
						}
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
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
			},
			registerCashierReceiver: function() {
				var self = this;
				var main = plus.android.runtimeMainActivity(); //获取activity
				//创建自定义广播实例
				var receiver = plus.android.implements(
					'io.dcloud.feature.internal.reflect.BroadcastReceiver', {
						onReceive: function(context, intent) { //实现onReceiver回调函数
							plus.android.importClass(intent); //通过intent实例引入intent类，方便以后的‘.’操作
							var isSuccess = intent.getExtra("isSuccess");
							var msg = intent.getExtra("msg");
							if(isSuccess) {
								self.payMent()
							} else {
								alert(msg);
							}
						}
					});

				var IntentFilter = plus.android
					.importClass('android.content.IntentFilter');
				var filter = new IntentFilter();

				filter.addAction("io.dcloud.pospay.cashiercallback"); //监听收银结果回调，自定义字符串

				main.registerReceiver(receiver, filter); //注册监听
			},
			doPosCashier: function() {
				var main_act = plus.android.runtimeMainActivity();
				var Intent = plus.android.importClass('android.content.Intent');
				var intent = new Intent();
				intent.setClassName(main_act, "io.dcloud.pospay.CashierService");

				var tradeNo = this.createTradeNoString();
				var seqNo = this.createSeqNoString();
				intent.putExtra("tradeNo", this.orderNumber); //商户订单号
				intent.putExtra("body", "这个是测试商品信息"); //订单描述
				intent.putExtra("attach", "这里是附加信息"); //附加数据,原样返回
				intent.putExtra("seqNo", seqNo); //订单序列号
				intent.putExtra("totalFee", (this.amount * 100).toString()); //订单金额，单位为分
				//intent.putExtra("pay_type", "1001");//付款方式 收银apk暂时不支持，等待开放, 1001	现金,1003	微信支付,1004	支付宝,1005	百度钱包,1006	银行卡,1007	易付宝,1008	点评闪惠,1009	京东钱包

				main_act.startService(intent);

			},
			createTradeNoString: function() {
				var d = new Date();
				return d.getHours() + d.getMinutes() + d.getSeconds() +
					d.getMilliseconds() + "";
			},
			createSeqNoString: function() {
				var d = new Date();
				return d.getHours() + d.getMinutes() + d.getSeconds() +
					d.getMilliseconds() + "";
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