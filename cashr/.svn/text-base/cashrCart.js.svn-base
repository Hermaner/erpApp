var goodsActionPage = {
	init: function() {
		this.vue = E.vue(this.vueObj), this.initConfig()
	},
	initConfig: function() {
		var self = this;
		mui.init({
			swipeBack: false,
		});
		mui.plusReady(function() {
			E.getStorage("imei") == 1 && (self.vue.hasImei = true);
			mui("#listPopover").on("tap", "li", function() {
				var pid = this.getAttribute("pid");
				self.vue.type = pid;
				switch (pid) {
					case "productName":
						self.vue.searchType = "商品名称";
						break;
					case "productNumber":
						self.vue.searchType = "商品编码";
						break;
					case "skuName":
						self.vue.searchType = "规格名称";
						break;
					case "skuNumber":
						self.vue.searchType = "规格编码";
						break;
					case "barcode":
						self.vue.searchType = "商品条码";
						break;
					case "ourPrice":
						self.vue.searchType = "销售价";
						break;
					case "infrared":
						self.vue.searchType = "红外扫描";
						break;
					default:
						break;
				}
				mui('#listPopover').popover('hide');
			});
			if (E.getStorage("holdData")) {
				mui("#holdBtn")[0].innerText = "取消挂起"
			} else {
				mui("#holdBtn")[0].innerText = "挂起"
			}
			self.cashrChart = mui.preload({
				id: 'cashrDetail.html',
				url: 'cashrDetail.html',
			});
		})
	},
	vueObj: {
		el: '#cashrCart',
		data: {
			items: [],
			type: "productName",
			searchType: "商品名称",
			title: "",
			searchtext: "",
			hasImei: false,
			selectListData: {},
			fuzzyData: []
		},
		methods: {
			loadData: function(val, d) {
				var self = this;
				var params = E.systemParam('V5.mobile.cart.item.search');
				params = mui.extend(params, {
					condition: val,
					type: d ? "barcode" : this.type
				})
				E.showLoading()
				E.getData('cartItemSearch', params, function(data) {
					E.closeLoading()
					console.log(JSON.stringify(data))
					if (!data.isSuccess) {
						E.alert(data.map.errorMsg)
						return
					}
					var products = data.productSkus;
					var exit = 0;
					if (products.length == 1) {
						var barcode = products[0].barcode;
						for (var i = 0; i < self.items.length; i++) {
							var thisCode = self.items[i].barcode;
							if (thisCode == barcode) {
								mui(".ListTag")[i].querySelector("[type='number']").value = parseInt(mui(".ListTag")[i].querySelector("[type='number']").value) + 1;
								exit = 1;
							}
						};
						!exit && (self.items = self.items.concat(products[0]))
					} else {
						self.fuzzyData = (products);
						setTimeout(function() {
							E.showLayer(0)
						}, 0)

					}
					setTimeout(function() {
						E.numBtn()
					}, 0)

				}, "get")

			},
			addItems: function() {
				var self = this;
				E.showLoading()
				var listitems = []
				mui(".fuzzyTag").each(function() {
					var index = this.getAttribute("dex");
					var barcode = this.getAttribute("barcode");
					var exit = 0;
					if (this.querySelector("[type=checkbox]").checked) {
						if (self.items.length > 0) {
							for (var i = 0; i < self.items.length; i++) {
								var thisCode = self.items[i].barcode;
								if (thisCode == barcode) {
									mui(".ListTag")[i].querySelector("[type='number']").value = parseInt(mui(".ListTag")[i].querySelector("[type='number']").value) + 1;
									exit = 1;
								}
							}
							if (!exit) {
								listitems = listitems.concat(self.fuzzyData[index]);
							}
						} else {
							listitems = listitems.concat(self.fuzzyData[index]);
						}

					}
				})
				setTimeout(function() {
					self.items = self.items.concat(listitems);
					E.closeLoading()
					self.fuzzyData = []
					setTimeout(function() {
						E.numBtn();
					}, 0)
				}, 0)

			},
			searchItem: function(c, d) {
				var val = c || this.searchtext;
				if (!val) {
					E.alert("请输入要查询的条件")
					return
				}
				this.searchtext = ""
				E.showLoading()
				this.loadData(val, d);
			},
			actionDelete: function() {
				var self = this
				var selectListData = E.getNumber({}, 1);
				if (!selectListData) {
					return
				}
				E.confirm("是否删除所选产品？", function() {
					self.items = E.getNewArray(self.items, selectListData.barcodeArray)
					self.clearSelect(self)
				})

			},
			delete: function(c) {
				var self = this;
				E.confirm("是否删除该商品", function() {
					self.items.splice(c, 1)
				})
			},
			closeMask: function() {
				this.fuzzyData = []
			},
			holdAll: function() {
				var self = this;
				if (E.getStorage("holdData")) {
					if (this.items.length > 0) {
						E.confirm("是否取消挂起清空购物车", function() {
							self.items = JSON.parse(E.getStorage("holdData"))
							mui("#holdBtn")[0].innerText = "挂起";
							E.removeStorage("holdData")
							setTimeout(function() {
								E.numBtn()
							}, 0)
						})
					} else {
						self.items = JSON.parse(E.getStorage("holdData"))
						mui("#holdBtn")[0].innerText = "挂起";
						E.removeStorage("holdData")
						setTimeout(function() {
							E.numBtn()
						}, 0)
					}


				} else {
					if (this.items.length <= 0) {
						E.alert("请选择商品") 
						return
					}
					for (var i = 0, len = mui(".ListTag").length; i < len; i++) {
						this.items[i].count = mui(".ListTag")[i].querySelector("[type='number']").value;
						console.log(mui(".ListTag")[i].querySelector("[type='number']").value)
					}
					E.setStorage("holdData", JSON.stringify(this.items))
					this.items = [];
					mui("#holdBtn")[0].innerText = "取消挂起"
				}

			},
			scanItem: function() {
				E.openWindow("../barcode/orderScan.html", {
					type: "cart"
				})
			},
			readyPay: function() {
				var self = this;
				if (self.items.length == 0) {
					E.alert("请选择商品")
					return
				}
				for (var i = 0, len = mui(".ListTag").length; i < len; i++) {
					this.items[i].count = mui(".ListTag")[i].querySelector("[type='number']").value;
				}
				E.fireData("cashrDetail.html", 'detailShow', {
					data: self.items
				})

			}
		}
	}
}
goodsActionPage.init();