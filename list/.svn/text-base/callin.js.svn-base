var param, itemone, itemtwo, toitemone, toitemtwo, callin, callout, callinbtnone, callinbtntwo, dataDel, callinjiahao, mypt, callStatus, callStatuson, outsaveBtn, insaveBtn, callAlink, detailPage, callOutpull, callInpull;

var aniShow = "pop-in";
var userResult, storelist;

mui.plusReady(function() {
	itemone = document.getElementById("itemone");
	itemtwo = document.getElementById("itemtwo");
	toitemone = document.getElementById("toitemone");
	toitemtwo = document.getElementById("toitemtwo");
	callAlink = document.getElementById("callAlink")
	callin = document.getElementById("callin");
	callout = document.getElementById("callout");
	callinbtnone = document.getElementById("callinbtnone");
	callinbtntwo = document.getElementById("callinbtntwo");
	callinjiahao = document.getElementById("callinjiahao");
	dataDel = document.getElementById("dataDel");
	callStatus = document.getElementById("callStatus");
	callStatuson = document.getElementById("callStatuson")
	outsaveBtn = document.getElementById("outsaveBtn")
	insaveBtn = document.getElementById("insaveBtn")
	detailPage = plus.webview.getWebviewById('calldetail.html')
	storelist = JSON.parse(plus.storage.getItem("storesList"))
	clickedFn('#item1', 'a');
	clickedFn('#item2', 'a');
	clickedFn('#tonewcalllist', '#callinjiahao');

	getOutData("ALL");
	getInData("UN_SEND");
	//		window.addEventListener('callInShow', function(event) {})
	//点击调出订单显示调出按钮
	callout.addEventListener("tap", function() {
		callinbtnone.style.display = "block";
		callinbtntwo.style.display = "none";
		callinjiahao.style.display = "block";
		callStatus.value = "callout"
	});
	//点击调入订单显示调人按钮
	callin.addEventListener("tap", function() {
		callinbtnone.style.display = "none";
		callinbtntwo.style.display = "block";
		callinjiahao.style.display = "none";
		callStatus.value = "callin"
	});
	mui("#callAlink").on('tap', "a", function() {
		var orderNumber = this.getAttribute('orderNumber');
		if (!orderNumber) {
			var href = this.getAttribute('href');
			window.location.href = href
			return
		}
		mui.fire(detailPage, 'detailShow', {
			orderNumber: orderNumber,
			callStatus: callStatus.value
		});
		setTimeout(function() {
			mui.openWindow({
				id: "calldetail.html",
				show: {
					aniShow: "pop-in"
				},
				waiting: {
					autoShow: false
				}
			})
		})

	})
	dataDel.addEventListener("tap", function() { //删除列表
		var list = toitemone.getElementsByClassName("mui-table-view-cell");
		var p = 0;
		var canstep = 0;
		checkAction(list, function() {
			while (p < list.length) {
				var listCheck = list[p].getElementsByTagName('input')[0];
				if (listCheck.checked) {
					canstep = 1;
					var orderNumber = listCheck.getAttribute("outNo")
					var param = systemParam("V5.mobile.allocate.out.cancel")
					param.outNo = orderNumber;
					dataSendFn("allocateOutCancel", param, function(data) {
						console.log(data)
						if (!data.isSuccess) {
							var mapmsg = data.map.errorMsg;
							plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
							return
						}
						toitemone.removeChild(list[p]);
						console.log(data)
					}, "get")
				}
				if (canstep == 1) {
					canstep = 0
					return
				} else {
					p++
				}

			}
		});
	});
	outsaveBtn.addEventListener("tap", function() { //调出保存数据
		var list = toitemone.getElementsByClassName("mui-table-view-cell");
		var outNo;
		var codecount;
		checkAction(list, function() {
			for (var i = 0; i < list.length; i++) {
				var listCheck = list[i].getElementsByTagName('input')[0];
				if (listCheck.checked) {
					console.log(listCheck)
					outNo = listCheck.getAttribute("outNo")
					codecount = list[i].getAttribute("codecount");
					break
				}
			}
			var param = systemParam('V5.mobile.allocate.out.confirm');
			var products = {};
			products.products = codecount
			console.log(products)
			param.outNo = outNo;
			param.applyData = JSON.stringify(products);
			param.uniqueCode = uniqueCode();
			console.log(param)
			dataSendFn('allocateOutConfirm', param, function(data) {
				if (!data.isSuccess) {
					var mapmsg = data.map.errorMsg;
					plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
					console.log(mapmsg)
					return
				}
				console.log(data.isSuccess)
			}, "get")
		});
	});
	insaveBtn.addEventListener("tap", function() { //调入保存数据
		var list = toitemtwo.getElementsByClassName("mui-table-view-cell");
		var inNo;
		var codecount;
		checkAction(list, function() {
			for (var i = 0; i < list.length; i++) {
				var listCheck = list[i].getElementsByTagName('input')[0];
				if (listCheck.checked) {
					inNo = listCheck.getAttribute("inNo")
					codecount = list[i].getAttribute("codecount");
					console.log(codecount)
					break
				}
			}
			var param = systemParam('V5.mobile.allocate.in.confirm');
			var products = {};
			products.products = codecount
			param.inNo = inNo;
			param.applyData = JSON.stringify(products);
			param.uniqueCode = uniqueCode();
			console.log(param)
			dataSendFn('allocateInConfirm', param, function(data) {
				if (!data.isSuccess) {
					var mapmsg = data.map.errorMsg;
					plus.nativeUI.alert(mapmsg, function() {}, "", "OK");
					console.log(mapmsg)
					return
				}
				console.log(data.isSuccess)
			}, "get")
		})

	});

});

function checkAction(e, callback) {
	var count = 0;
	var audit = 0;
	for (var i = 0; i < e.length; i++) {
		var listCheck = e[i].getElementsByTagName('input')[0];
		if (listCheck.checked) {
			count = 1;
			if (e[i].getAttribute("then") == 1) {
				audit = 1;
			}
		}

	}
	if (count == 0) {
		plus.nativeUI.alert("请选择订单！", function() {}, "", "OK");
		return
	}
	if (audit == 1) {
		plus.nativeUI.alert("已审核的订单不允许进行此操作！", function() {}, "", "OK");
		return
	}
	callback()
}

function detailBack(e, b) {
		console.log("详情返回删除")
		var c = b ? toitemtwo : toitemone
		var list = c.getElementsByClassName("mylistcell");
		console.log(list.length)
		var p = 0;
		console.log(list.length)
		while (p < list.length) {
			var rid = list[p].getAttribute("rid");
			if (rid == e) {
				console.log(111)
				c.removeChild(list[p]);
				return
			} else {
				p++
			}

		}
	}
	(function($) {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		$('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		$.ready(function() {
			//循环初始化所有下拉刷新，上拉加载。
			$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				$(pullRefreshEl).pullToRefresh({
					up: {
						callback: function() {
							var callStatusVal = callStatus.value;
							var callStatusonVal = callStatuson.value;
							var self = this;
							if (index == 0) {
								callOutpull = self
								getOutData(callStatusonVal)
								self.endPullUpToRefresh();
							} else {
								callInpull = self
								getInData(callStatusonVal)
								self.endPullUpToRefresh();
							}

						}
					}
				});
			});
		});
	})(mui);




var outitemId = null;

function getOutData(b) {
	var param = systemParam("V5.mobile.allocate.out.search")
	param.status = b;
	param.optype = "up";
	param.pageSize = 4;
	param.allocateOutId = outitemId || "";
	console.log(outitemId)
	dataSendFn("allocateOutSearch", param, function(data) {
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			console.log(mapmsg)
			callOutpull&&callOutpull.endPullUpToRefresh(true)
			return
		}
		callOutpull && callOutpull.endPullUpToRefresh(false)
		var totalCount = data.totalCount;
		var orders = data.orders;
		outitemId = orders[orders.length - 1].allocateOutId;
		for (var i = 0; i < orders.length; i++) {
			var allocateOutId = orders[i].allocateOutId;
			var allocateOutNo = orders[i].allocateOutNo;
			var inStore = orders[i].inStore;
			var orderAllocateStatus = orders[i].orderAllocateStatus;
			var productNum = orders[i].productNum;
			var products = orders[i].products;
			var orderAllocateStatus2;
			var codecount = [];
			var then = "";
			var tel;
			for (var i = 0; i < storelist.length; i++) {
				var storeName = storelist[i].storeName;
				if (inStore == storeName) {
					tel = storelist[i].mobile || storelist[i].phone
				}
			}
			if (orderAllocateStatus == 1) {
				orderAllocateStatus2 = "未审核";
			} else {
				orderAllocateStatus2 = "已审核";
				then = 1;
			}
			var linkhtml = "";
			for (var j = 0; j < products.length; j++) {
				var productNumber = products[j].productNumber;
				var productName = products[j].productName;
				var productPic = products[j].productPic || "../images/cbd.jpg";
				var skuNumber = products[j].skuNumber;
				var skuName = products[j].skuName;
				var barcode = products[j].barcode;
				var count = products[j].count;
				codecount.push({
					barcode: barcode,
					stock: count
				})
				linkhtml += '<a class="mui-flex-all dd-top mui-flex-abottom" href="listdetail.html" orderNumber="' + allocateOutNo + '"><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + '</span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><span class="mui-flex-block mui-flex-positionright">*' + count + '</span></div></a>'

			}
			var html = '<div class="mui-input-group"><div class="mui-flex-all"><div class="mui-input-row mui-checkbox mui-flex-checkwidth"><input name="checkbox" outNo="' + allocateOutNo + '" class="changeinput" value="Item 1" type="checkbox"></div><div class="mui-table-flex"><div class="mui-flex-all"><span class="mui-table-flex mui-dingdan-padding mui-flex-margintop"><span class="mui-flex-block">' + allocateOutNo + '</span></span><span class="mui-table-flex2 mui-flex-margintop mui-flex-textcenter"></span><div class="mui-flex-width mui-flex-margintop mui-text-right"></div></div>' + linkhtml + '</div></div><div><div class="mui-pull-left mui-callin-marginleft"><span>调入门店：' + inStore + '</span></div><div class="mui-pull-right"><span>共' + productNum + '件商品</span></div></div><div class="maxwidth ld-divbot mui-callin-margin"><div class="mui-pull-left ld-lianxi ld-lianxi2 ci-zuo"><span class="mui-icon iconfont icon-dianhuahaoma1"></span><a class="lianxi-padding2 mui-tel-link"  href="tel:' + tel + '">联系门店</a></div><div class="mui-pull-right ci-you"><span>' + orderAllocateStatus2 + '</span></div><div class="clearboth"></div></div></div>'

			var li = document.createElement("li");
			li.className = "mui-table-view-cell mylistcell";
			li.setAttribute("codecount", JSON.stringify(codecount))
			li.setAttribute("rid", allocateOutNo)
			li.setAttribute("then", then)
			li.innerHTML = html;
			toitemone.appendChild(li);
		}

	}, "get")
}
var initemId = null;

function getInData(b) {
	var param = systemParam("V5.mobile.allocate.in.search")
	param.status = b;
	param.optype = "up";
	param.pageSize = 3;
	param.allocateInId = initemId || "";
	console.log(initemId)
	dataSendFn("allocateInSearch", param, function(data) { 
		if (!data.isSuccess) {
			var mapmsg = data.map.errorMsg;
			callInpull&&callInpull.endPullUpToRefresh(true)
			return
		}
		callInpull && callInpull.endPullUpToRefresh(false)
		var totalCount = data.totalCount;
		var orders = data.orders;
		initemId = orders[orders.length - 1].allocateInId
		for (var i = 0; i < orders.length; i++) {
			var allocateInId = orders[i].allocateInId;
			var allocateInNo = orders[i].allocateInNo;
			var outStore = orders[i].outStore;
			var orderAllocateStatus = orders[i].orderAllocateStatus;
			var productNum = orders[i].productNum;
			var products = orders[i].products;
			var orderAllocateStatus2;
			var codecount = [];
			var tel;
			for (var i = 0; i < storelist.length; i++) {
				var storeName = storelist[i].storeName;
				if (outStore == storeName) {
					tel = storelist[i].mobile || storelist[i].phone
				}
			}
			if (orderAllocateStatus == 1) {
				orderAllocateStatus2 = "未审核";
			} else {
				orderAllocateStatus2 = "已审核";
			}
			var linkhtml = "";
			html += '</div></div></div></div>';
			for (var j = 0; j < products.length; j++) {
				var productNumber = products[j].productNumber;
				var productName = products[j].productName;
				var productPic = products[j].productPic || "../images/cbd.jpg";
				var skuNumber = products[j].skuNumber;
				var skuName = products[j].skuName;
				var barcode = products[j].barcode;
				var count = products[j].count;
				codecount.push({
					barcode: barcode,
					stock: count
				})
				linkhtml += '<a class="mui-flex-all dd-top mui-flex-abottom" href="listdetail.html" orderNumber="' + allocateInNo + '"><img class="itempic" src="' + productPic + '"><div class="mui-table-flex mui-flex-lineheight"><span class="mui-flex-block">' + productName + '</span><span class="mui-flex-block">' + productNumber + '</span><span class="mui-flex-block">' + skuName + '</span></div><div class="cellpad mui-flex-width"><span class="mui-flex-block mui-flex-positionright">*' + count + '</span></div></a>'
			}
			var html = '<div class="mui-input-group"><div class="mui-flex-all"><div class="mui-input-row mui-checkbox mui-flex-checkwidth"><input name="checkbox" inNo="' + allocateInNo + '" class="changeinput" value="Item 1" type="checkbox"></div><div class="mui-table-flex"><div class="mui-flex-all"><span class="mui-table-flex mui-dingdan-padding mui-flex-margintop"><span class="mui-flex-block">' + allocateInNo + '</span></span><span class="mui-table-flex2 mui-flex-margintop mui-flex-textcenter"></span><div class="mui-flex-width mui-flex-margintop mui-text-right"></div></div>' + linkhtml + '</div></div><div><div class="mui-pull-left mui-callin-marginleft"><span>调出门店：' + outStore + '</span></div><div class="mui-pull-right"><span>共' + productNum + '件商品</span></div></div><div class="maxwidth ld-divbot mui-callin-margin"><div class="mui-pull-left ld-lianxi ld-lianxi2 ci-zuo"><span class="mui-icon iconfont icon-dianhuahaoma1"></span><a class="lianxi-padding2 mui-tel-link"  href="tel:' + tel + '">联系门店</a></div><div class="mui-pull-right ci-you"><span>' + orderAllocateStatus2 + '</span></div><div class="clearboth"></div></div></div>'
			var li = document.createElement("li");
			li.className = "mui-table-view-cell mylistcell";
			li.setAttribute("codecount", JSON.stringify(codecount))
			li.setAttribute("rid", allocateInNo)
			li.innerHTML = html;
			toitemtwo.appendChild(li);
		}

	}, "get")
}



(function($, doc) {
	$.init();
	$.ready(function() {
		//普通示例
		var userPicker = new $.PopPicker();
		userPicker.setData([{
			value: 'FINISH',
			text: '已审核'
		}, {
			value: 'UN_SEND',
			text: '未审核'
		}, {
			value: '全部状态',
			text: '全部状态'
		}]);
		var showUserPickerButton = doc.getElementById('showUserPicker');
		userResult = doc.getElementById('userResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0].text;
				var val = items[0].value;
				callStatuson.value = val;
				var callStatusVal = callStatus.value;
				var callStatusValon = callStatuson.value;
				if (callStatusVal == "callout") {
					outitemId = null;
					callOutpull&&callOutpull.refresh(true)
					toitemone.innerHTML = ""
					getOutData(callStatusValon)
				} else {
					initemId = null;
					callInpull&&callInpull.refresh(true)
					toitemtwo.innerHTML = ""
					getInData(callStatusValon)
				}
			});

		}, false);

	});
})(mui, document);