var Page = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.init({
			preloadPages: [{
				"id": "enterCoupon",
				"url": "enterCoupon.html",
			}, {
				"id": "caserInnode",
				"url": "caserInnode.html",
			}, {
				"id": "caserIndetail",
				"url": "caserIndetail.html",
			}]
		})
		mui.plusReady(function() {
			self.vue.store = E.getStorage('store')
		});
	},
	vueObj: {
		el: '#vue',
		data: {
			amount: '',
			memo: '',
			coupon: '0',
			denomination: 0,
			discount: 10,
			couponCode: '',
			store: '',
			payments: [{
				paymentName: '支付宝扫码',
				paymentType: '6'
			}, {
				paymentName: '微信扫码',
				paymentType: '15'
			}, {
				paymentName: '会员卡支付',
				paymentType: '16'
			}, {
				paymentName: '刷卡支付',
				paymentType: '14'
			}, {
				paymentName: '现金支付',
				paymentType: '13'
			}],
			paymentType: '',
			orderNumber: '',
			password: '',
			memberCardNumber: '',
			showCardpay: false

		},
		methods: {
			loadData: function(c) {
				console.log(c)
			},
			writeScan: function() {
				var reNum = /^\d+(.\d{1,2})?$/;
				if(!reNum.test(this.amount)){
					mui.toast('请输入正确金额')
					return 
				}
				E.openWindow('../barcode/orderScan.html', {
					type: 'caserIn'
				})
			},
			gocaserNode: function() {
				E.fireData('caserInnode', 'detailShow')
			},
			loadCoupon: function(c) {
				var self = this;
				var params = E.systemParam("V5.mobile.order.coupon.get");
				params = mui.extend(params, {
					couponCode: c
				})
				E.getData('couponGet', params, function(data) {
					console.log(data)
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					data = data.coupon
					var conditions = data.conditions;
					var beginning = data.beginning
					var termination = data.termination
					var nowing = new Date()
					beginning = new Date(beginning.replace(/-/g, "/"));
					termination = new Date(termination.replace(/-/g, "/"));
					self.denomination = 0;
					self.discount = 10;
					if(termination < nowing) {
						E.alert('优惠劵已失效！')
						return
					}
					if(beginning > nowing){
						E.alert('优惠劵未开始！')
						return
					}
					switch(data.couponType) {
						case 1: //满减
							var denomination = data.denomination
							if(!self.amount) {
								E.alert('请输入正确金额')
								return
							}
							if(conditions != '' && conditions > 0 && parseFloat(conditions) > parseFloat(self.amount)) {
								E.alert('订单金额没有达到赠送条件')
								return
							}
							console.log(data.channelCouponStores)
							if(self.storeJoinCount(data.channelCouponStores)) {
								//成功赠送
								//赠送金额为denomination
								self.denomination = denomination
							} else {
								E.alert('优惠劵在当前门店不可用')
								return
							}
							break;
						case 2: //折扣
							var discount = data.discount
							if(!self.amount) {
								E.alert('请输入正确金额')
								return
							}

							if(conditions != '' && conditions > 0 && parseFloat(conditions) > parseFloat(self.amount)) {
								E.alert('订单金额没有达到赠送条件')
								return
							}
							if(self.storeJoinCount(data.channelCouponStores)) {
								//成功赠送
								//赠送折扣为discount
								self.discount = discount
							} else {
								E.alert('优惠劵在当前门店不可用')
								return
							}
							break;
						case 3: //赠品
							E.alert('此优惠劵不能使用')
							break;
						default:
							break;
					}
				}, "get")
			},
			amountBlur:function(){
				var reNum = /^\d+(.\d{1,2})?$/;
				if(!reNum.test(this.amount)){
					mui.toast('金额输入错误')
					return
				}
			},
			storeJoinCount: function(stores) {
				var status = false
				var self = this;
				for(var i in stores) {
					if(self.store == stores[i].name) {
						status = true
					}
				}
				return status
			},
			checkBack: function(c, d) {
				if(d == 1) {
					this.denomination = c;
				} else {
					this.discount = c
				}

			},
			createOrder: function() {
				var obj = {
					receiptAmount: this.amount,
					discountFee: this.coupon,
					paymentType: this.paymentType,
					memo: this.memo,
					couponCode: this.couponCode
				}
				obj = JSON.stringify(obj)
				var self = this;
				var params = E.systemParam('V5.mobile.receivables.history.add');
				params = mui.extend(params, {
					receivablesData: obj
				})
				E.showLoading()
				E.getData('receivablesHistoryAdd', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.orderNumber = data.number
					self.paySwitch()
				})
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
					case "16":
						this.cardMethod()
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
					type: "pay"
				})
			},
			cardMethod: function() {
				this.showCardpay = true;
				setTimeout(function() {
					E.showLayer(0)
				}, 0)

			},
			closeCardpay: function() {
				this.showCardpay = false;
				this.paymentType = ''
			},
			cardPay: function() {
				var self = this;
				if(!this.password || !this.memberCardNumber) {
					E.toast("信息不全");
					return
				}
				var params = E.systemParam("V5.mobile.erp.pay");
				params = mui.extend(params, {
					number: this.orderNumber,
					authCode: '',
					password: this.password,
					memberCardNumber: this.memberCardNumber,
					paymentType: 16,
					type: "pay"

				})
				E.showLoading()
				E.getData('erpPay', params, function(data) {
					self.closeCardpay()
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg);
						return
					}
					self.completePay("支付成功")
				}, "get")
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
					type: "pay"
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
			completePay: function(c) {
				var self = this
				E.alert(c, function() {
					self.paymentType = ''
					mui.back()
				})
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

		},
		computed: {
			actual: function() {
				var reNum = /^\d+(.\d{1,2})?$/;
				if(!reNum.test(this.amount)){
					return 0
				}
				var value = parseFloat(this.amount || 0) * this.discount * 100 / 1000 - parseFloat(this.denomination || 0);
				value = value < 0 ? 0 : value
				this.coupon = parseFloat(this.amount || 0) - value
				return value
			}
		}
	}

}
Page.init()