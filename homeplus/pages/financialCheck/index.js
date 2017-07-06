var Page = {
	status: 0,
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.plusReady(function() {
			self.vue.userGet()
			
		});
	},
	vueObj: {
		el: '#vue',
		data: {
			paytype: '',
			person: '',
			beginText: '',
			endText: '',
			beginFont: '',
			endFont: '',
			amountStatistics: [],
			users: [],
			payments: [],
			datetime: '',
			curTime: '',
			showData: true,
			noData: false
		},
		ready:function(){
			var now = new Date()
			var m = now.getMonth() + 1;
			m = m < 10 ? '0' + m : m
			var thisTime = now.getFullYear() + '-' + m + '-' + now.getDate()
			this.curTime = '{"value":"' + thisTime + '"}'
			this.beginFont = thisTime
			this.endFont = thisTime
			this.beginText = new Date(thisTime.replace(/-/g, "/")).getTime();
			this.endText = new Date(thisTime.replace(/-/g, "/")).getTime();
			this.datetime = thisTime + '/' + thisTime;
		},
		methods: {
			userGet: function() {
				var self = this;
				var params = E.systemParam('V5.mobile.user.get');
				E.getData('userGet', params, function(data) {
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.users = data.userGets
					self.loadpayType()
				}, "get")
			},
			loadpayType: function() {
				var self = this;
				var params = E.systemParam("V5.mobile.paymentType.search");
				E.getData('paymentTypeSearch', params, function(data) {
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.payments = data.payments;
					self.loadData()
				}, "get")
			},
			loadData: function() {
				var self = this;
				var params = E.systemParam('V5.mobile.finance.account');
				params = mui.extend(params, {
					operatorName: this.person || '',
					paymentTypeId: this.paytype || '',
					datetime: this.datetime || ''
				})
				console.log(this.datetime)
				this.amountStatistics = []
				this.noData = false
				this.showData = true
				E.getData('financeAccount', params, function(data) {
					Page.status = 1
					self.showData = false
					console.log(JSON.stringify(data))
					if(!data.isSuccess) {
						if(data.map.errorMsg == '没有收款统计数据') {
							self.noData = true
						} else {
							E.alert(data.map.errorMsg)
						}
						return
					}
					self.amountStatistics = data.amountStatistics
				}, 'get')
			},
			optionTime: function(options, c) {
				var self = this
				var picker = new mui.DtPicker(options);
				picker.show(function(rs) {
					var rsTime = new Date(rs.text.replace(/-/g, "/")).getTime();
					c ? self.beginText = rsTime : self.endText = rsTime;
					if(self.beginText && self.endText && self.endText < self.beginText) {
						if(c) {
							self.beginText = ''
							self.beginFont = '选择日期'
						} else {
							self.endText = ''
							self.endFont = '选择日期'
						}
						alert('开始时间不能大于结束时间')
						return
					}
					c ? self.beginFont = rs.text : self.endFont = rs.text
					picker.dispose();
				});
			},
		},
		watch: {
			paytype: function() {
				this.loadData()
			},
			person: function() {
				this.loadData()
			},
			beginFont: function() {
				if(this.beginFont == '选择日期' || this.endFont == '选择日期' || Page.status == 0) {
					return
				}
				this.datetime = this.beginFont + '/' + this.endFont
				this.loadData()
			},
			endFont: function() {
				if(this.beginFont == '选择日期' || this.endFont == '选择日期' || Page.status == 0) {
					return
				}
				this.datetime = this.beginFont + '/' + this.endFont
				this.loadData()
			}
		},
		computed: {
			total: function() {
				if(this.amountStatistics.length == 0) {
					return false
				}
				var amount = 0;
				for(var i = 0; i < this.amountStatistics.length; i++) {
					if(this.amountStatistics[i].paymentTypeName == '定金支出') {
						amount -= parseFloat(this.amountStatistics[i].amount)
					} else {
						amount += parseFloat(this.amountStatistics[i].amount)
					}

				}
				return amount
			}
		}
	}

}
Page.init()