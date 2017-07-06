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
			E.getStorage("imei") == 1 && (self.vue.hasImei = true);
			mui("#itemList").on('tap', "li", function() {
				var dex = parseInt(this.getAttribute("dex"))
				E.openWindow("goodsDetail.html", {
					items: self.vue.items[dex]
				})

			})
		})
	},
	pullRefreshdown: function() {
		Page.vue.loadData()
	},
	vueObj: {
		el: '#goods',
		data: {
			items: [],
			searchtext: "",
			hasImei: false
		},
		methods: {
			loadData: function(val, c) {
				var self = this;
				(val || c) && (Page.ItemId = null)
				var params = E.systemParam('V5.mobile.item.sku.search');
				params = mui.extend(params, {
					condition: val || "",
					productItemId: Page.ItemId || "",
					pageSize: 15,
					optype: "up",
				})
				E.getData('itemSkuSearch', params, function(data) {
					E.closeLoading();
					(val || c) && (self.items = [])
					if (!data.isSuccess) {
						mui('#tochange').pullRefresh().endPullupToRefresh(true);
						E.alert(data.map.errorMsg)
						return
					}
					c && (plus.os.name == "Android" ? (window.scrollTo(0, 0)) : (mui('#tochange').pullRefresh().scrollTo(0, 0)));
					var products = data.productSkus;
					self.items = self.items.concat(products);
					Page.ItemId = val ? 1 : products[products.length - 1].productItemId;
					mui('#tochange').pullRefresh().endPullupToRefresh(false);
					(products.length < 15) && (mui('#tochange').pullRefresh().endPullupToRefresh(true))
					val && (mui('#tochange').pullRefresh().disablePullupToRefresh())
				}, "get")
			},
			searchItem: function(c) {
				var val = c || this.searchtext;
				E.showLoading()
				mui("#tochange").pullRefresh().refresh(true);
				mui('#tochange').pullRefresh().enablePullupToRefresh();
				Page.ItemId = null
				this.loadData(val, 1);
				this.searchtext = ""
			},
			goItemScan: function() {
				E.openWindow("../barcode/orderScan.html", {
					type: "item"
				})
			}
		}
	}
}
Page.init()