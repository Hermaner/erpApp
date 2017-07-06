var Page = {
	ItemId: null,
	init: function() {
		this.initConfig(), this.vue = E.vue(this.vueObj)
	},
	initConfig: function() {
		var self = this;
		mui.init({
			pullRefresh: {
				container: '#tochange',
				down: {
					callback: self.pullRefreshDown
				},
				up: {
					contentrefresh: '正在刷新中...',
					callback: self.pullRefreshUp
				}
			},
			preloadPages: [{
				"id": "selectcoupon",
				"url": "selectcoupon.html",
			}, {
				"id": "smsmodel",
				"url": "smsmodel.html",
			}]
		});
		mui.plusReady(function() {
			mui('#tochange').on('tap', '.mui-checkbox', function() {
				var target = this.querySelector('input');
				var index = target.getAttribute('index')
				var status = target.checked
				self.vue.items[index].status = !status
				var count = 0
				for(var i = 0; i < self.vue.items.length; i++) {
					if(self.vue.items[i].status) {
						count++
					}
				}
				self.vue.countNum=count;
				if(count == self.vue.items.length) {
					mui('.checkAll')[0].checked = true
				} else {
					mui('.checkAll')[0].checked = false
				}

			});
			document.getElementsByClassName('screen-content')[0].addEventListener('touchmove', function(e) {
				if(e.target.tagName != 'BUTTON' && e.target.tagName != 'button') {
					e.preventDefault();
				}
			})
			self.vue.loadData();
			self.vue.loadLevels();
			self.vue.loadGroups();
		});
	},
	pullRefreshUp: function() {
		Page.vue.loadData()
	},
	pullRefreshDown: function() {
		mui('#tochange').pullRefresh().endPulldownToRefresh();
		Page.vue.loadData(1)
	},
	vueObj: {
		el: '#vue',
		data: {
			showData: true,
			noData: false,
			beginText: '',
			endText: '',
			beginFont: '选择日期',
			endFont: '选择日期',
			sexval: '',
			showscreen: false,
			province: "",
			city: "",
			cityarea: "",
			pData: pData,
			cData: [],
			caData: [],
			levels:[],
			groups:[],
			level: 0,
			group: 0,
			allIntstart: '',
			allIntend: '',
			curIntstart: '',
			curIntend: '',
			amountstart: '',
			amountend: '',
			items: [],
			tel: '',
			queryContent: '',
			countNum:0
		},
		methods: {
			loadData: function(c) {
				var self = this;
				if(c) {
					Page.ItemId = null
					mui('.checkAll')[0].checked = false
				}
				var params = E.systemParam('V5.mobile.channel.member.search');
				params = mui.extend(params, {
					memberData: this.queryContent,
					orderId: Page.ItemId || "",
					pageSize: 15,
					optype: "up",
				})
				this.tel = ''
				this.noData = false
				E.getData('channelMemberSearch', params, function(data) {
					self.showData = false
					E.closeLoading();
					console.log(JSON.stringify(data))
					c && (self.items = [])
					if(!data.isSuccess) {
						if(data.map.errorMsg=='没有更多会员数据'&&self.items.length == 0) {
							self.noData = true
						}
						mui('#tochange').pullRefresh().endPullupToRefresh(true);
						E.alert(data.map.errorMsg)
						return
					}
					
					self.showData = false
					c && (plus.os.name == "Android" ? (window.scrollTo(0, 0)) : (mui('#tochange').pullRefresh().scrollTo(0, 0)));
					var memberSearchs = data.memberSearchs;
					for(var i = 0, len = memberSearchs.length; i < len; i++) {
						memberSearchs[i].status = false
					}
					self.items = self.items.concat(memberSearchs);
					Page.ItemId = memberSearchs[memberSearchs.length - 1].orderId;
					console.log(Page.ItemId)
					mui('#tochange').pullRefresh().endPullupToRefresh(false);
					(memberSearchs.length < 15) && (mui('#tochange').pullRefresh().endPullupToRefresh(true))
				}, "get", function() {
					self.showData = false
				})
			},
			loadLevels: function() {
				var self = this;
				var params = E.systemParam('V5.mobile.channelMemberLevel.Search');

				E.getData('channelMemberLevelSearch', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.levels = data.channelMemberLevels
				}, "get")
			},
			loadGroups: function() {
				var self = this;
				var params = E.systemParam('V5.mobile.channelMember.group.search');

				E.getData('channelMemberGroupSearch', params, function(data) {
					console.log(JSON.stringify(data))
					E.closeLoading()
					if(!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					self.groups = data.memberGroupSearch
				}, "get")
			},
			sendpage: function(c) {
				E.fireData('sendpage', '', {
					data: c
				})
			},
			searchItem: function() {
				if(!this.tel) {
					mui.toast('请输入手机号')
					return
				}
				var telReg = !!(this.tel).match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
				if(telReg == false) {
					E.toast("请输入正确的手机号")
					this.tel = ""
					return
				}
				this.queryContent = JSON.stringify({
					mobilePhone: this.tel
				})
				this.items = []
				this.showData = true
				this.loadData(1)
			},
			optionTime: function(options, c) {
				var self = this
				var picker = new mui.DtPicker(options);
				picker.show(function(rs) {
					console.log(rs)
					var rsDate = rs.y.value + '-' + rs.m.value + '-' + rs.d.value + ' ' + rs.h.value + ':' + rs.i.value
					var rsTime = new Date(rsDate.replace(/-/g, "/")).getTime();
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
					c ? self.beginFont = rsDate + ':00' : self.endFont = rsDate + ':59'
					picker.dispose();
				});
			},
			checkItem: function(c) {
				if(mui("button")[c].classList.contains('cur')) {
					return
				} else {
					mui("button.cur")[0].classList.remove("cur")
					mui("button")[c].classList.add("cur")
				}
				this.showData = true
			},
			selectAll: function() {
				var status = mui('.checkAll')[0].checked
				
				for(var i = 0, len = this.items.length; i < len; i++) {
					mui('.mui-checkbox')[i].querySelector('input').checked = status
					this.items[i].status = status
				}
				if(status){
					this.countNum=this.items.length
				}
				else{
					this.countNum=0
				}
			},
			selectcoupon: function() {
				var telData = []
				for(var i = 0, len = this.items.length; i < len; i++) {
					if(this.items[i].status) {
						telData.push(this.items[i].mobilePhone)
					}
				}
				if(telData.length == 0) {
					mui.toast('请选择会员')
					return
				}
				E.fireData('selectcoupon', '', {
					telData: telData.join(',')
				})
			},

			doScreen: function() {
				var reNum = /^\d+(.\d{1,2})?$/;
				if((this.allIntstart && !reNum.test(this.allIntstart)) || (this.allIntend && !reNum.test(this.allIntend))) {
					alert('累计积分格式错误')
					return
				}
				if((this.curIntstart && !reNum.test(this.curIntstart)) || (this.curIntend && !reNum.test(this.curIntend))) {
					alert('当前积分格式错误')
					return
				}
				if((this.amountstart && !reNum.test(this.amountstart)) || (this.amountend && !reNum.test(this.amountend))) {
					alert('消费金额格式错误')
					return
				}
				if(this.allIntend && (parseFloat(this.allIntstart) > parseFloat(this.allIntend))) {
					alert('累计积分输入错误')
					return
				}
				if(this.curIntend && (parseFloat(this.curIntstart) > parseFloat(this.curIntend))) {
					alert('当前积分输入错误')
					return
				}
				if(this.amountend && (parseFloat(this.amountstart) > parseFloat(this.amountend))) {
					alert('消费金额输入错误')
					return
				}
				var obj = {
					sex: this.sexval,
					provinceName: this.province,
					cityName: this.city,
					cityAreaName: this.cityarea,
					memberLevel: this.level,
					memberGroup: this.group,
					registerStartDate: this.beginFont == '选择日期' ? '' : this.beginFont,
					registerEndDate: this.endFont == '选择日期' ? '' : this.endFont,
					pointTotalStart: this.allIntstart,
					pointTotalEnd: this.allIntend,
					currentPointStart: this.curIntstart,
					currentPointEnd: this.curIntend,
					totalAmountStart: this.amountstart,
					totalAmountEnd: this.amountend
				}
				this.queryContent = JSON.stringify(obj)
				this.loadData(1)
				this.showData = true
				this.closeScreen()
				this.items = []
				console.log(obj)
			},
			closeScreen: function() {
				this.showscreen = false
				mui('#tochange').pullRefresh().setStopped(false);
			},
			openScreen: function() {
				this.showscreen = true;
				mui('#tochange').pullRefresh().setStopped(true);

			},
			closeScoll: function(e) {
				e.preventDefault();
			}
		}
	}

}

function changeProvince(e) {
	var pindex = e.selectedIndex;
	Page.vue.cData = cData[pindex - 1]
	Page.vue.caData = []
	Page.vue.city = ""
	Page.vue.cityarea = ""
	Page.vue.address = ""
}

function changeCity(e) {
	var psex = mui("#province")[0].selectedIndex - 1;
	var psexcount = 0;
	for(var i = 0; i < psex; i++) {
		psexcount += cData[i].length;
	}
	var pindex = psexcount + e.selectedIndex;
	var caData = cyData[pindex - 1]
	if(!caData.length && e.value) {
		Page.vue.caData.push(e.value)
	} else {
		Page.vue.caData = caData
	}
	Page.vue.cityarea = ""
	Page.vue.address = ""
}

Page.init()