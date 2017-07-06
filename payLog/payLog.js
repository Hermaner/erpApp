var Page = {
	ItemId: null,
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.init({
			pullRefresh: {
				container: '#tochange',
				up: {
					contentdown: '上拉加载更多',
					contentrefresh: '正在刷新中...',
					callback: self.pullRefreshdown
				}
			}
		});
		mui.plusReady(function() {
			mui("#orderList").on('tap', "a", function() {
				var pid = this.getAttribute("payId")
				E.fireData("payDetail.html", "detialShow", {
					payId: pid,
				})
			})
			self.payDetail = mui.preload({
				id: 'payDetail.html',
				url: 'payDetail.html',
			});
			self.pullRefreshdown()
		})
	},
	pullRefreshdown: function() {
		Page.vue.loadData()
	},
	vueObj: {
		el: '#vue',
		data: {
			items: [],
			searchtext: ""
		},
		methods: {
			loadData: function(val, c) {
				(c || val) && (Page.ItemId = null, this.items = [])

				var self = this;
				var params = E.systemParam('V5.mobile.order.money.search');
				params = mui.extend(params, {
					condition: val || "",
					orderId: Page.ItemId || "",
					pageSize: 15,
					optype: "up",
				})
				E.showLoading()
				E.getData('orderMoneySearch', params, function(data) {
					E.closeLoading()
					if (!data.isSuccess) {
						mui('#tochange').pullRefresh().endPullupToRefresh(true);
						E.alert(data.map.errorMsg)
						return
					}
					c && (plus.os.name == "Android" ? (window.scrollTo(0, 0)) : (mui('#tochange').pullRefresh().scrollTo(0, 0)));
					var orders = data.orders;
					self.items = self.items.concat(orders);
					Page.ItemId = val ? 1 : orders[orders.length - 1].orderId;
					mui('#tochange').pullRefresh().endPullupToRefresh(false);
					(orders.length < 15) && (mui('#tochange').pullRefresh().endPullupToRefresh(true))
					val && (mui('#tochange').pullRefresh().disablePullupToRefresh())
				}, "get")
			},
			searchItem: function() {
				var val = this.searchtext;
				E.showLoading()
				mui("#tochange").pullRefresh().refresh(true);
				mui('#tochange').pullRefresh().enablePullupToRefresh();
				Page.ItemId = null
				this.loadData(val);
				this.searchtext = ""
			},
			addAddress: function() {
				E.fireData("payDetail.html", "detialShow")
			}
		}
	}
}
Page.init()